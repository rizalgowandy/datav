import { useMemo, useState } from 'react';
import { filterSpans } from './JaegerComponents';
import { TraceSpan } from './JaegerComponents/types/trace';

/**
 * Controls the state of search input that highlights spans if they match the search string.
 * @param spans
 */
export function useSearch(spans?: TraceSpan[]) {
  const [search, setSearch] = useState('');
  const spanFindMatches: Set<string> | undefined = useMemo(() => {
    return search && spans ? filterSpans(search, spans) : undefined;
  }, [search, spans]);

  return { search, setSearch, spanFindMatches };
}
