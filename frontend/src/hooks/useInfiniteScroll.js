import { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';

export const useInfiniteScroll = (fetchCallback, options = {}) => {
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    
    const loadMore = useCallback(
        debounce(async () => {
            if (loading || !hasMore) return;
            
            setLoading(true);
            try {
                const newItems = await fetchCallback(page);
                if (newItems.length < options.pageSize) {
                    setHasMore(false);
                }
                setItems(prev => [...prev, ...newItems]);
                setPage(prev => prev + 1);
            } catch (error) {
                console.error('Error loading more items:', error);
            } finally {
                setLoading(false);
            }
        }, 200),
        [page, loading, hasMore, fetchCallback]
    );
    
    return { items, loading, hasMore, loadMore };
}; 