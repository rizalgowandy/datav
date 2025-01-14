import React, { HTMLProps, useRef } from 'react';
import { SelectableValue } from '../../../data';
import { Select } from '../Select/Select';
import { useTheme2 } from '../../themes/ThemeContext';

/** @internal
 * Should be used only internally by Segment/SegmentAsync which can guarantee that SegmentSelect is hidden
 * when a value is selected. See comment below on closeMenuOnSelect()
 */
export interface Props<T> extends Omit<HTMLProps<HTMLDivElement>, 'value' | 'onChange'> {
  value?: SelectableValue<T>;
  options: Array<SelectableValue<T>>;
  onChange: (item: SelectableValue<T>) => void;
  onClickOutside: () => void;
  width: number;
  noOptionsMessage?: string;
  allowCustomValue?: boolean;
  /**
   * If true, empty value will be passed to onChange callback otherwise using empty value
   * will work as canceling and using the previous value
   */
  allowEmptyValue?: boolean;
  placeholder?: string;
}

/** @internal */
export function SegmentSelect<T>({
  value,
  placeholder = '',
  options = [],
  onChange,
  onClickOutside,
  width: widthPixels,
  noOptionsMessage = '',
  allowCustomValue = false,
  allowEmptyValue = false,
  ...rest
}: React.PropsWithChildren<Props<T>>) {
  const ref = useRef<HTMLDivElement>(null);
  const theme = useTheme2();

  let width = widthPixels > 0 ? widthPixels / theme.spacing.gridSize : undefined;

  return (
    <div {...rest} ref={ref}>
      <Select
        menuShouldPortal
        width={width}
        noOptionsMessage={noOptionsMessage}
        placeholder={placeholder}
        autoFocus={true}
        isOpen={true}
        onChange={onChange}
        options={options}
        value={value}
        // Disable "close menu on select" option to avoid calling onChange() in onCloseMenu() when a value is selected.
        // Once the value is selected the Select component (with the menu) will be hidden anyway by the parent component:
        // Segment or SegmentAsync - hence setting this option has no UX effect.
        closeMenuOnSelect={false}
        onCloseMenu={() => {
          if (ref && ref.current) {
            // https://github.com/JedWatson/react-select/issues/188#issuecomment-279240292
            // Unfortunately there's no other way of retrieving the value (not yet) created new option
            const input = ref.current.querySelector('input[id^="react-select-"]') as HTMLInputElement;
            if (input && (input.value || allowEmptyValue)) {
              onChange({ value: input.value as any, label: input.value });
            } else {
              onClickOutside();
            }
          }
        }}
        allowCustomValue={allowCustomValue}
      />
    </div>
  );
}
