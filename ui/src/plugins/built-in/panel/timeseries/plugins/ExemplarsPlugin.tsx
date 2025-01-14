import {
  DataFrame,
  DataFrameFieldIndex,
  Field,
  LinkModel,
  TimeZone,
  TIME_SERIES_TIME_FIELD_NAME,
  TIME_SERIES_VALUE_FIELD_NAME,
} from 'src/packages/datav-core/src';
import { EventsCanvas, FIXED_UNIT, UPlotConfigBuilder, usePlotContext } from 'src/packages/datav-core/src/ui';
import React, { useCallback } from 'react';
import { ExemplarMarker } from './ExemplarMarker';

interface ExemplarsPluginProps {
  config: UPlotConfigBuilder;
  exemplars: DataFrame[];
  timeZone: TimeZone;
  getFieldLinks: (field: Field, rowIndex: number) => Array<LinkModel<Field>>;
}

export const ExemplarsPlugin: React.FC<ExemplarsPluginProps> = ({ exemplars, timeZone, getFieldLinks, config }) => {
  const plotCtx = usePlotContext();

  const mapExemplarToXYCoords = useCallback(
    (dataFrame: DataFrame, dataFrameFieldIndex: DataFrameFieldIndex) => {
      const plotInstance = plotCtx.plot;
      const time = dataFrame.fields.find((f) => f.name === TIME_SERIES_TIME_FIELD_NAME);
      const value = dataFrame.fields.find((f) => f.name === TIME_SERIES_VALUE_FIELD_NAME);

      if (!time || !value || !plotInstance) {
        return undefined;
      }

      // Filter x, y scales out
      const yScale =
        Object.keys(plotInstance.scales).find((scale) => !['x', 'y'].some((key) => key === scale)) ?? FIXED_UNIT;

      const yMin = plotInstance.scales[yScale].min;
      const yMax = plotInstance.scales[yScale].max;

      let y = value.values.get(dataFrameFieldIndex.fieldIndex);
      // To not to show exemplars outside of the graph we set the y value to min if it is smaller and max if it is bigger than the size of the graph
      if (yMin != null && y < yMin) {
        y = yMin;
      }

      if (yMax != null && y > yMax) {
        y = yMax;
      }

      return {
        x: plotInstance.valToPos(time.values.get(dataFrameFieldIndex.fieldIndex), 'x'),
        y: plotInstance.valToPos(y, yScale),
      };
    },
    [plotCtx]
  );

  const renderMarker = useCallback(
    (dataFrame: DataFrame, dataFrameFieldIndex: DataFrameFieldIndex) => {
      return (
        <ExemplarMarker
          timeZone={timeZone}
          getFieldLinks={getFieldLinks}
          dataFrame={dataFrame}
          dataFrameFieldIndex={dataFrameFieldIndex}
          config={config}
        />
      );
    },
    [config, timeZone, getFieldLinks]
  );

  return (
    <EventsCanvas
      config={config}
      id="exemplars"
      events={exemplars}
      renderEventMarker={renderMarker}
      mapEventToXYCoords={mapExemplarToXYCoords}
    />
  );
};
