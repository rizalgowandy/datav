import { DashboardModel } from "./DashboardModel";
import _ from 'lodash'
import { dashboardMock } from './mocks'
import { DashboardDTO, ThunkResult, GlobalVariableUid } from "src/types";
import { getBackendSrv, config, getTemplateSrv, currentLang } from "src/packages/datav-core/src";
import { store } from 'src/store/store'
import { initDashboardTemplating, processVariables, completeDashboardTemplating } from "src/views/variables/state/actions";
import { dashboardInitCompleted, dashboardInitError } from "src/store/reducers/dashboard";
import { annotationsSrv } from 'src/views/annotations/annotations_srv';
import { message } from "antd";
import localStore from "src/core/library/utils/localStore";
import { getKeybindingSrv } from "src/core/services/keybinding";
import { Langs } from "src/core/library/locale/types";
import { getTimeSrv, TimeSrv } from "src/core/services/time";
import { DashboardSrv, getDashboardSrv } from "../services/dashboard_srv";
import { createDashboardQueryRunner } from "./DashboardQueryRunner/DashboardQueryRunner";

/**
 * This action (or saga) does everything needed to bootstrap a dashboard & dashboard model.
 * First it handles the process of fetching the dashboard, correcting the url if required (causing redirects/url updates)
 *
 * This is used both for single dashboard & solo panel routes, home & new dashboard routes.
 *
 * Then it handles the initializing of the old angular services that the dashboard components & panels still depend on
 *
 */
export function initDashboard(uid: string | undefined, initOrigin?: any): ThunkResult<void> {
  return async (dispatch, getState) => {
    // try {
    let ds: DashboardModel;
    if (!uid) {
      // return new dashboard
      ds = new DashboardModel(getNewDashboardModelData().dashboard, getNewDashboardModelData().meta)
    } else {
      try {
        const res = await getBackendSrv().get(`/api/dashboard/uid/${uid}`)
        ds = new DashboardModel(res.data.dashboard, res.data.meta)
      } catch (error) {
        dispatch(dashboardInitError(error.status))
        return
      }
    }

    if (ds.enableGlobalVariable) {
      const gres = await getBackendSrv().get(`/api/dashboard/uid/-1`)
      const gds = new DashboardModel(gres.data.dashboard, gres.data.meta)

      // combine dashboard variables and global variables, specially, dashboard ones will overrides global ones
      for (let i = 0; i < gds.templating.list.length; i++) {
        const gvar = gds.templating.list[i]
        let exist = false
        for (let j = 0; j < ds.templating.list.length; j++) {
          const dvar = ds.templating.list[j]
          if (dvar.name === gvar.name) {
            exist = true
            break
          }
        }
        if (!exist) {
          ds.templating.list.push(gvar)
        }
      }

      ds.templating.list.forEach((v) => {
        // for global variables, we need to check cached selections exists in local storage
        if (v.global) {
          const cachedGvar = localStore.get('datav.global.variable.' + v.name)
          if (cachedGvar) {
            // set current
            v.current = JSON.parse(cachedGvar)
            // set option is selected
            for (let i = 0; i < v.options.length; i++) {
              const option = v.options[i]
              let exist = false
              for (let j = 0; j < v.current.value.length; j++) {
                if (v.current.value[j] === option.value) {
                  exist = true
                }
              }

              option.selected = exist
            }
          }
        }
      })
    }
    // template values service needs to initialize completely before
    // the rest of the dashboard can load
    try {
      if (config.featureToggles.newVariables) {
        dispatch(initDashboardTemplating(ds.templating.list));
        await dispatch(processVariables(true));
        dispatch(completeDashboardTemplating(ds));
      }
    } catch (err) {
      message.error('Templating init failed')
      console.log(err);
    }

    getKeybindingSrv().setupDashboardBindings(ds)

    // init services
    const timeSrv:TimeSrv  = getTimeSrv();
    const dashboardSrv: DashboardSrv = getDashboardSrv();
    
    // legacy srv state, we need this value updated for built-in annotations
    dashboardSrv.setCurrent(ds);

    const runner = createDashboardQueryRunner({ dashboard:ds, timeSrv:timeSrv });
    runner.run({ dashboard:ds, range: timeSrv.timeRange() });

    initOrigin(ds)
  
    dispatch(dashboardInitCompleted(ds))
  }
}

export function resetDashboardVariables(ds: DashboardModel): ThunkResult<void> {
  return async (dispatch, getState) => {
    // template values service needs to initialize completely before
    // the rest of the dashboard can load
    try {
      if (config.featureToggles.newVariables) {
        dispatch(initDashboardTemplating(ds.templating.list));
        await dispatch(processVariables(true));
        dispatch(completeDashboardTemplating(ds));
      }
    } catch (err) {
      message.error('Templating init failed')
      console.log(err);
    }

  }
}

export function setVariablesFromUrl(ds0:any): ThunkResult<void> {
  return async (dispatch, getState) => {
    const ds = _.cloneDeep(ds0)
    // template values service needs to initialize completely before
    // the rest of the dashboard can load
    try {
      if (config.featureToggles.newVariables) {
        dispatch(initDashboardTemplating(ds.templating.list));
        await dispatch(processVariables(true));
        dispatch(completeDashboardTemplating(ds));
      }
    } catch (err) {
      // message.error('Templating init failed')
      console.log(err);
    }
  }
}


function getNewDashboardModelData(): DashboardDTO {
  const data = {
    meta: {
      canEdit: true,
      canStar: true,
      canShare: true,
      canSave: true,
      isNew: true,
      folderId: 0,
    },
    dashboard: {
      title: currentLang === Langs.Chinese?  '新建仪表盘' : 'New dashboard',
      panels: [
        {
          id: 1,
          type: 'add-panel',
          gridPos: { x: 0, y: 0, w: 12, h: 9 },
          title: 'Panel Title',
          options: {
            lines: true
          }
        },
      ],
      enableGlobalVariable: true,
      showHeader: true,
      templating: {
      }
    },
  };

  return data;
}
