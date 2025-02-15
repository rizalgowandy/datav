import React, { memo, useCallback } from 'react';
import { MatcherUIProps, FieldMatcherUIRegistryItem } from './types';
import { FieldMatcherID, fieldMatchers, SelectableValue, ByNamesMatcherOptions } from '../../../data';
import { MultiSelect } from '../Select/Select';
import { Input } from '../Input/Input';
import { useFieldDisplayNames, useSelectOptions, frameHasName } from './utils';

export const FieldNamesMatcherEditor = memo<MatcherUIProps<ByNamesMatcherOptions>>((props) => {
  const { data, options, onChange: onChangeFromProps } = props;
  const { readOnly, prefix } = options;
  const names = useFieldDisplayNames(data);
  const selectOptions = useSelectOptions(names, undefined);

  const onChange = useCallback(
    (selections: Array<SelectableValue<string>>) => {
      if (!Array.isArray(selections)) {
        return;
      }

      return onChangeFromProps({
        ...options,
        names: selections.reduce((all: string[], current) => {
          if (!frameHasName(current.value, names)) {
            return all;
          }
          all.push(current.value!);
          return all;
        }, []),
      });
    },
    [names, onChangeFromProps, options]
  );

  if (readOnly) {
    const displayNames = (options.names ?? []).join(', ');
    return <Input value={displayNames} readOnly={true} disabled={true} prefix={prefix} />;
  }

  return <MultiSelect menuShouldPortal value={options.names} options={selectOptions} onChange={onChange} />;
});
FieldNamesMatcherEditor.displayName = 'FieldNameMatcherEditor';

export const fieldNamesMatcherItem: FieldMatcherUIRegistryItem<ByNamesMatcherOptions> = {
  id: FieldMatcherID.byNames,
  component: FieldNamesMatcherEditor,
  matcher: fieldMatchers.get(FieldMatcherID.byNames),
  name: 'Fields with names',
  description: 'Set properties for a specific field',
  optionsToLabel: (options) => (options.names ?? []).join(', '),
  excludeFromPicker: true,
};
