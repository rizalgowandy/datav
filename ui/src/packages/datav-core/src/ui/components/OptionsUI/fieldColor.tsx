import React, { CSSProperties, FC } from 'react';
import {
  FieldConfigEditorProps,
  FieldColorModeId,
  SelectableValue,
  FieldColor,
  fieldColorModeRegistry,
  FieldColorMode,
  GrafanaTheme2,
  FieldColorConfigSettings,
  FieldColorSeriesByMode,
  getFieldColorMode,
} from '../../../data';
import { Select } from '../Select/Select';
import { ColorValueEditor } from './color';
import { useStyles2, useTheme2 } from '../../themes/ThemeContext';
import { css } from '@emotion/css';
import { Field } from '../Forms/Field';
import { RadioButtonGroup } from '../Forms/RadioButtonGroup/RadioButtonGroup';

export const FieldColorEditor: React.FC<FieldConfigEditorProps<FieldColor | undefined, FieldColorConfigSettings>> = ({
  value,
  onChange,
  item,
}) => {
  const theme = useTheme2();
  const styles = useStyles2(getStyles);

  const colorMode = getFieldColorMode(value?.mode);
  const availableOptions = item.settings?.byValueSupport
    ? fieldColorModeRegistry.list()
    : fieldColorModeRegistry.list().filter((m) => !m.isByValue);

  const options = availableOptions.map((mode) => {
    let suffix = mode.isByValue ? ' (by value)' : '';

    return {
      value: mode.id,
      label: `${mode.name}${suffix}`,
      description: mode.description,
      isContinuous: mode.isContinuous,
      isByValue: mode.isByValue,
      component() {
        return <FieldColorModeViz mode={mode} theme={theme} />;
      },
    };
  });

  const onModeChange = (newMode: SelectableValue<string>) => {
    onChange({
      ...value,
      mode: newMode.value! as FieldColorModeId,
    });
  };

  const onColorChange = (color?: string) => {
    onChange({
      ...value,
      mode,
      fixedColor: color,
    });
  };

  const onSeriesModeChange = (seriesBy?: FieldColorSeriesByMode) => {
    onChange({
      ...value,
      mode,
      seriesBy,
    });
  };

  const mode = value?.mode ?? FieldColorModeId.Thresholds;

  if (mode === FieldColorModeId.Fixed) {
    return (
      <div className={styles.group}>
        <Select
          menuShouldPortal
          minMenuHeight={200}
          options={options}
          value={mode}
          onChange={onModeChange}
          className={styles.select}
        />
        <ColorValueEditor value={value?.fixedColor} onChange={onColorChange} />
      </div>
    );
  }

  if (item.settings?.bySeriesSupport && colorMode.isByValue) {
    const seriesModes: Array<SelectableValue<FieldColorSeriesByMode>> = [
      { label: 'Last', value: 'last' },
      { label: 'Min', value: 'min' },
      { label: 'Max', value: 'max' },
    ];

    return (
      <>
        <div style={{ marginBottom: theme.spacing(2) }}>
          <Select menuShouldPortal minMenuHeight={200} options={options} value={mode} onChange={onModeChange} />
        </div>
        <Field label="Color series by">
          <RadioButtonGroup value={value?.seriesBy ?? 'last'} options={seriesModes} onChange={onSeriesModeChange} />
        </Field>
      </>
    );
  }

  return <Select menuShouldPortal minMenuHeight={200} options={options} value={mode} onChange={onModeChange} />;
};

interface ModeProps {
  mode: FieldColorMode;
  theme: GrafanaTheme2;
}

const FieldColorModeViz: FC<ModeProps> = ({ mode, theme }) => {
  if (!mode.getColors) {
    return null;
  }

  const colors = mode.getColors(theme).map(theme.visualization.getColorByName);
  const style: CSSProperties = {
    height: '8px',
    width: '100%',
    margin: '2px 0',
    borderRadius: '3px',
    opacity: 1,
  };

  if (mode.isContinuous) {
    style.background = `linear-gradient(90deg, ${colors.join(',')})`;
  } else {
    let gradient = '';
    let lastColor = '';

    for (let i = 0; i < colors.length; i++) {
      const color = colors[i];
      if (gradient === '') {
        gradient = `linear-gradient(90deg, ${color} 0%`;
      } else {
        const valuePercent = i / (colors.length - 1);
        const pos = valuePercent * 100;
        gradient += `, ${lastColor} ${pos}%, ${color} ${pos}%`;
      }
      lastColor = color;
    }
    style.background = gradient;
  }

  return <div style={style} />;
};

const getStyles = (theme: GrafanaTheme2) => {
  return {
    group: css`
      display: flex;
    `,
    select: css`
      margin-right: 8px;
      flex-grow: 1;
    `,
  };
};
