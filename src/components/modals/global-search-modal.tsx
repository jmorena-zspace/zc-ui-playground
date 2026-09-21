import { SearchInput } from '@components/inputs';
import { QuickResults } from '@components/quick-results';
import { useGlobalSearch } from '@hooks/global-search';
import { useNavigate } from '@tanstack/react-router';
import { BlurredModal } from './blurred-modal';

const QUICK_RESULTS_VIEWPORT_PADDING = 40;

export type GlobalSearchModalProps = {
  show: boolean;
  onClose: () => void;
};

export function GlobalSearchModal({ show, onClose }: GlobalSearchModalProps) {
  const {
    search,
    query,
    onSearchChange,
    onKeyDown,
    resetSearch,
    request: { isLoadingResults, showResults, resultsHaveHits, searchResult },
    inputErrorMessage,
  } = useGlobalSearch({
    onEnterKeyDownHandler: (q) => {
      handleClose();
      navigate({ to: '/search', search: { q } });
    },
  });

  const navigate = useNavigate();

  const handleClose = () => {
    resetSearch();
    onClose();
  };

  const onViewAllSearchResults = () => {
    handleClose();
    navigate({ to: '/search', search: { q: query } });
  };

  const onLessonClick = (lessonId: string) => {
    handleClose();
    navigate({ to: '/search', search: { q: query, lesson: lessonId } });
  };

  return (
    <BlurredModal show={show} onClose={handleClose} size="2xl">
      <div className="relative flex flex-col w-full gap-sm">
        <SearchInput
          isLoading={isLoadingResults}
          value={search}
          onChange={onSearchChange}
          onKeyDown={onKeyDown}
          showEscHint
          errorMessage={inputErrorMessage}
        />
        <QuickResults
          boundary="viewport"
          offset={QUICK_RESULTS_VIEWPORT_PADDING}
          showResults={showResults}
          resultsHaveHits={resultsHaveHits}
          results={searchResult?.hits}
          total={searchResult?.totalResults}
          search={query}
          onViewAllSearchResults={onViewAllSearchResults}
          onLessonClick={onLessonClick}
        />
      </div>
    </BlurredModal>
  );
}
