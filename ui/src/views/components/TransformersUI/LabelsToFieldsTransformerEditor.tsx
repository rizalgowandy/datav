import React from 'react';
import {
  DataTransformerID,
  SelectableValue,
  standardTransformers,
  TransformerRegistryItem,
  TransformerUIProps,
} from 'src/packages/datav-core/src';
import { Select } from 'src/packages/datav-core/src/ui';

import { LabelsToFieldsOptions } from 'src/packages/datav-core/src/data/transformations/transformers/labelsToFields';

export const LabelsAsFieldsTransformerEditor: React.FC<TransformerUIProps<LabelsToFieldsOptions>> = ({
  input,
  options,
  onChange,
}) => {
  let labelNames: Array<SelectableValue<string>> = [];
  let uniqueLabels: Record<string, boolean> = {};

  for (const frame of input) {
    for (const field of frame.fields) {
      if (!field.labels) {
        continue;
      }

      for (const labelName of Object.keys(field.labels)) {
        if (!uniqueLabels[labelName]) {
          labelNames.push({ value: labelName, label: labelName });
          uniqueLabels[labelName] = true;
        }
      }
    }
  }

  const onValueLabelChange = (value: SelectableValue<string> | null) => {
    onChange({ valueLabel: value?.value });
  };

  return (
    <div className="gf-form-inline">
      <div className="gf-form">
        <div className="gf-form-label width-8">Value field name</div>
        <Select
          menuShouldPortal
          isClearable={true}
          allowCustomValue={false}
          placeholder="(Optional) Select label"
          options={labelNames}
          className="min-width-18 gf-form-spacing"
          value={options?.valueLabel}
          onChange={onValueLabelChange}
        />
      </div>
    </div>
  );
};

export const labelsToFieldsTransformerRegistryItem: TransformerRegistryItem<LabelsToFieldsOptions> = {
  id: DataTransformerID.labelsToFields,
  editor: LabelsAsFieldsTransformerEditor,
  transformation: standardTransformers.labelsToFieldsTransformer,
  name: 'Labels to fields',
  description: `Groups series by time and return labels or tags as fields.
                Useful for showing time series with labels in a table where each label key becomes a separate column`,
};
