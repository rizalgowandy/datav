import React from 'react';
import {
  DataLink,
  DataLinksFieldConfigSettings,
  FieldConfigEditorProps,
  VariableSuggestionsScope,
} from '../../../data';
import { DataLinksInlineEditor } from '../DataLinks/DataLinksInlineEditor/DataLinksInlineEditor';

export const DataLinksValueEditor: React.FC<FieldConfigEditorProps<DataLink[], DataLinksFieldConfigSettings>> = ({
  value,
  onChange,
  context,
}) => {
  return (
    <DataLinksInlineEditor
      links={value}
      onChange={onChange}
      data={context.data}
      getSuggestions={() => (context.getSuggestions ? context.getSuggestions(VariableSuggestionsScope.Values) : [])}
    />
  );
};
