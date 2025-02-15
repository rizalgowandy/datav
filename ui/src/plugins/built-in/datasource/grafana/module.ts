import { DataSourcePlugin } from 'src/packages/datav-core/src/data';
import { GrafanaDatasource } from './datasource';
import { QueryEditor } from './components/QueryEditor';
import { GrafanaQuery } from './types';

export const plugin = new DataSourcePlugin<GrafanaDatasource, GrafanaQuery>(GrafanaDatasource).setQueryEditor(
  QueryEditor
);
