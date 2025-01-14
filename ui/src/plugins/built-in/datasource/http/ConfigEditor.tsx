import { DataSourcePluginOptionsEditorProps } from 'src/packages/datav-core/src';
import { DataSourceHttpSettings } from 'src/packages/datav-core/src/ui';
import React, { ComponentType } from 'react';
import { DataSourceOptions } from './types';

type Props = DataSourcePluginOptionsEditorProps<DataSourceOptions>;

export const ConfigEditor: ComponentType<Props> = ({ options, onOptionsChange }) => {
  return (
    <>
      <DataSourceHttpSettings
        defaultUrl={'http://localhost:8080'}
        dataSourceConfig={options}
        showAccessOptions={true}
        onChange={onOptionsChange}
      />
    </>
  );
};
