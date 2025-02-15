import React, { FC, memo, useState } from 'react';
import { css } from 'emotion';
import { HorizontalGroup, stylesFactory, useTheme, Spinner} from 'src/packages/datav-core/src/ui';

import { contextSrv } from 'src/core/services/context';
import EmptyListCTA from 'src/views/components/EmptyListCTA/EmptyListCTA';
import { FilterInput } from 'src/views/components/FilterInput/FilterInput';
import { FolderDTO } from 'src/types';
import { useManageDashboards } from '../hooks/useManageDashboards';
import { SearchLayout } from '../types';
import { ConfirmDeleteModal } from './ConfirmDeleteModal';
import { MoveToFolderModal } from './MoveToFolderModal';
import { useSearchQuery } from '../hooks/useSearchQuery';
import { SearchResultsFilter } from './SearchResultsFilter';
import { SearchResults } from './SearchResults';
import { DashboardActions } from './DashboardActions';
import localeData from 'src/core/library/locale'
import { getState } from 'src/store/store';
import { GrafanaTheme } from 'src/packages/datav-core/src';

export interface Props {
  folder: FolderDTO;
}

const { isEditor } = contextSrv;

export const ManageDashboards: FC<Props> = memo(({ folder }) => {
  const folderId = folder?.id;
  const folderUid = folder?.uid;
  const theme = useTheme();
  const styles = getStyles(theme);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const defaultLayout = folderId ? SearchLayout.List : SearchLayout.Folders;
  const queryParams = {
    skipRecent: true,
    skipStarred: true,
    folderIds: folderId ? [folderId] : [],
    layout: defaultLayout,
  };

  const {
    query,
    hasFilters,
    onQueryChange,
    onTagFilterChange,
    onTeamChange,
    onStarredFilterChange,
    onTagAdd,
    onSortChange,
    onLayoutChange,
  } = useSearchQuery(queryParams);

  const {
    results,
    loading,
    initialLoading,
    canSave,
    allChecked,
    hasEditPermissionInFolders,
    canMove,
    canDelete,
    onToggleSection,
    onToggleChecked,
    onToggleAllChecked,
    onDeleteItems,
    onMoveItems,
    noFolders,
  } = useManageDashboards(query, {}, folder);

  const onMoveTo = () => {
    setIsMoveModalOpen(true);
  };

  const onItemDelete = () => {
    setIsDeleteModalOpen(true);
  };

  if (initialLoading) {
    return <Spinner className={styles.spinner} />;
  }

  if (noFolders && !hasFilters) {
    return (
      <EmptyListCTA
        title="This folder doesn't have any dashboards yet"
        buttonIcon="plus"
        buttonTitle="Create Dashboard"
        buttonLink={`dashboard/new?folderId=${folderId}`}
        proTip="Add/move dashboards to your folder at ->"
        proTipLink="dashboards"
        proTipLinkTitle="Manage dashboards"
        proTipTarget=""
      />
    );
  }
  
  return (
    <div className={styles.container}>
      <div>
        <HorizontalGroup justify="space-between">
          <FilterInput
            labelClassName="gf-form--has-input-icon"
            inputClassName="gf-form-input width-20"
            value={query.query}
            onChange={onQueryChange}
            placeholder={localeData[getState().application.locale]['folder.searchPlaceholder']}
          />
          <DashboardActions isEditor={isEditor} canEdit={hasEditPermissionInFolders || canSave} folderId={folderId} />
        </HorizontalGroup>
      </div>

      <div className={styles.results}>
        <SearchResultsFilter
          allChecked={allChecked}
          canDelete={hasEditPermissionInFolders && canDelete}
          canMove={hasEditPermissionInFolders && canMove}
          deleteItem={onItemDelete}
          moveTo={onMoveTo}
          onToggleAllChecked={onToggleAllChecked}
          onStarredFilterChange={onStarredFilterChange}
          onSortChange={onSortChange}
          onTagFilterChange={onTagFilterChange}
          onTeamChange={onTeamChange}
          query={query}
          hideLayout={!!folderUid}
          onLayoutChange={onLayoutChange}
          editable={hasEditPermissionInFolders}
        />
        <SearchResults
          loading={loading}
          results={results}
          editable={hasEditPermissionInFolders}
          onTagSelected={onTagAdd}
          onToggleSection={onToggleSection}
          onToggleChecked={onToggleChecked}
          layout={query.layout}
        />
      </div>
      <ConfirmDeleteModal
        onDeleteItems={onDeleteItems}
        results={results}
        isOpen={isDeleteModalOpen}
        onDismiss={() => setIsDeleteModalOpen(false)}
      />
      <MoveToFolderModal
        onMoveItems={onMoveItems}
        results={results}
        isOpen={isMoveModalOpen}
        onDismiss={() => setIsMoveModalOpen(false)}
      />
    </div>
  );
});

const getStyles = stylesFactory((theme: GrafanaTheme) => {
  return {
    container: css`
      label: search-container;
      height: 95%;
    `,
    results: css`
      display: flex;
      flex-direction: column;
      flex: 1;
      height: 100%;
      margin-top: ${theme.spacing.md};
    `,
    spinner: css`
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 200px;
    `,
  };
});
