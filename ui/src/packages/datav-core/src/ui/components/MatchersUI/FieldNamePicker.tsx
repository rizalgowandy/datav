import React, { useCallback } from 'react';
import { FieldNamePickerConfigSettings, SelectableValue, StandardEditorProps } from '../../../data';
import { Select } from '../Select/Select';
import { useFieldDisplayNames, useSelectOptions, frameHasName } from './utils';

// Pick a field name out of the fulds
export const FieldNamePicker: React.FC<StandardEditorProps<string, FieldNamePickerConfigSettings>> = ({
  value,
  onChange,
  context,
  item,
}) => {
  const settings: FieldNamePickerConfigSettings = item.settings ?? {};
  const names = useFieldDisplayNames(context.data, settings?.filter);
  const selectOptions = useSelectOptions(names, value);

  const onSelectChange = useCallback(
    (selection: SelectableValue<string>) => {
      if (!frameHasName(selection.value, names)) {
        return;
      }
      return onChange(selection.value!);
    },
    [names, onChange]
  );

  const selectedOption = selectOptions.find((v) => v.value === value);
  return (
    <>
      <Select
        menuShouldPortal
        value={selectedOption}
        options={selectOptions}
        onChange={onSelectChange}
        noOptionsMessage={settings.noFieldsMessage}
      />
      {settings.info && <settings.info name={value} field={names.fields.get(value)} />}
    </>
  );
};
