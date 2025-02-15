import { isDateTime, TimeOption, TimeRange, TimeZone,GrafanaTheme} from 'src/packages/datav-core/src';
import {stylesFactory,CustomScrollbar, useTheme} from 'src/packages/datav-core/src/ui';
import { css } from 'emotion';
import React, {useState } from 'react';
import { useMedia } from 'react-use';
import {UpOutlined,DownOutlined} from '@ant-design/icons';
import { mapRangeToTimeOption } from './mapper';
import { TimePickerTitle } from './TimePickerTitle';
import { TimeRangeForm } from './TimeRangeForm';
import { TimeRangeList } from './TimeRangeList';
import { FormattedMessage  as Message} from 'react-intl';
import { getThemeColors } from './colors' 

const getStyles = stylesFactory((theme: GrafanaTheme) => {
  const colors = getThemeColors(theme);

  return {
    container: css`
      display: flex;
      background: ${colors.background};
      box-shadow: 0px 0px 20px ${colors.shadow};
      position: absolute;
      z-index: ${theme.zIndex.modal};
      width: 546px;
      height: 381px;
      top: 116%;
      margin-left: -322px;

      @media only screen and (max-width: ${theme.breakpoints.lg}) {
        width: 218px;
        margin-left: 6px;
      }

      @media only screen and (max-width: ${theme.breakpoints.sm}) {
        width: 264px;
        margin-left: -100px;
      }
    `,
    leftSide: css`
      display: flex;
      flex-direction: column;
      border-right: 1px solid ${colors.border};
      width: 60%;
      overflow: hidden;

      @media only screen and (max-width: ${theme.breakpoints.lg}) {
        display: none;
      }
    `,
    rightSide: css`
      width: 40% !important;

      @media only screen and (max-width: ${theme.breakpoints.lg}) {
        width: 100% !important;
      }
    `,
    spacing: css`
      margin-top: 16px;
    `,
  };
});

const getNarrowScreenStyles = stylesFactory((theme: GrafanaTheme) => {
  const colors = getThemeColors(theme);

  return {
    header: css`
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid ${colors.border};
      padding: 7px 9px 7px 9px;
    `,
    body: css`
      border-bottom: 1px solid ${colors.border};
      background: ${colors.formBackground};
      box-shadow: inset 0px 2px 2px ${colors.shadow};
    `,
    form: css`
      padding: 7px 9px 7px 9px;
    `,
  };
});

const getFullScreenStyles = stylesFactory((theme: GrafanaTheme) => {
  return {
    container: css`
      padding-top: 9px;
      padding-left: 11px;
      padding-right: 20%;
    `,
    title: css`
      margin-bottom: 11px;
    `,
    recent: css`
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
    `,
  };
});

const getEmptyListStyles = stylesFactory((theme: GrafanaTheme) => {
  const colors = getThemeColors(theme);

  return {
    container: css`
      background-color: ${colors.formBackground};
      padding: 12px;
      margin: 12px;

      a,
      span {
        font-size: 13px;
      }
    `,
    link: css`
      color: ${theme.colors.linkExternal};
    `,
  };
});


interface Props {
  value: TimeRange;
  onChange: (timeRange: TimeRange) => void;
  timeZone?: TimeZone;
  quickOptions?: TimeOption[];
  otherOptions?: TimeOption[];
  history?: TimeRange[];
}

interface PropsWithScreenSize extends Props {
  isFullscreen: boolean;
}

interface FormProps extends Omit<Props, 'history'> {
  visible: boolean;
  historyOptions?: TimeOption[];
}

export const TimePickerContentWithScreenSize: React.FC<PropsWithScreenSize> = props => {
  const theme = useTheme();
  const styles = getStyles(theme);
  const historyOptions = mapToHistoryOptions(props.history, props.timeZone);
  const { quickOptions = [], otherOptions = [], isFullscreen } = props;

  return (
    <div className={styles.container}>
      <div className={styles.leftSide}>
        <FullScreenForm {...props} visible={isFullscreen} historyOptions={historyOptions} />
      </div>
      <CustomScrollbar className={styles.rightSide}>
        <NarrowScreenForm {...props} visible={!isFullscreen} historyOptions={historyOptions} />
        <TimeRangeList
          title={<Message id="dashboard.relativeTimePickerTitle" />}
          options={quickOptions}
          onSelect={props.onChange}
          value={props.value}
          timeZone={props.timeZone}
        />
        <div className={styles.spacing} />
        <TimeRangeList
          title="Other quick ranges"
          options={otherOptions}
          onSelect={props.onChange}
          value={props.value}
          timeZone={props.timeZone}
        />
      </CustomScrollbar>
    </div>
  );
};

export const TimePickerContent: React.FC<Props> = props => {
  const isFullscreen = useMedia(`(min-width: 992px)`);

  return <TimePickerContentWithScreenSize {...props} isFullscreen={isFullscreen} />;
};

const NarrowScreenForm: React.FC<FormProps> = props => {
  const isAbsolute = isDateTime(props.value.raw.from) || isDateTime(props.value.raw.to);
  const [collapsed, setCollapsed] = useState(isAbsolute);

  const theme = useTheme();

  const styles = getNarrowScreenStyles(theme);

  if (!props.visible) {
    return null;
  }


  
  return (
    <>
      <div className={styles.header} onClick={() => setCollapsed(!collapsed)}>
        <TimePickerTitle><Message id="dashboard.timePickerTitle" /></TimePickerTitle>
        {collapsed ? <UpOutlined translate="true" />: <DownOutlined translate="true"/>}
      </div>
      {collapsed && (
        <div className={styles.body}>
          <div className={styles.form}>
            <TimeRangeForm
              value={props.value}
              onApply={props.onChange}
              timeZone={props.timeZone}
              isFullscreen={false}
            />
          </div>
        </div>
      )}
    </>
  );
};

const FullScreenForm: React.FC<FormProps> = props => {
  const theme = useTheme();
  const styles = getFullScreenStyles(theme);

  if (!props.visible) {
    return null;
  }

  return (
    <>
      <div className={styles.container}>
        <div className={styles.title}>
          <TimePickerTitle><Message id="dashboard.absoluteTimePickerTitle" /></TimePickerTitle>
        </div>
        <TimeRangeForm value={props.value} timeZone={props.timeZone} onApply={props.onChange} isFullscreen={true} />
      </div>
    </>
  );
};

function mapToHistoryOptions(ranges?: TimeRange[], timeZone?: TimeZone): TimeOption[] {
  if (!Array.isArray(ranges) || ranges.length === 0) {
    return [];
  }
  return ranges.slice(ranges.length - 4).map(range => mapRangeToTimeOption(range, timeZone));
}
