import { observer } from 'mobx-react-lite';
import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { Button, Grid, Loader } from 'semantic-ui-react';
import LoadingComponent from '../../../app/layout/LoadingComponent';
import { useStore } from '../../../app/stores/store';
import { PagingParams } from '../../../models/pagination';
import ActivityFilter from './ActivityFilter';
import ActivityList from './ActivityList';



export default observer ( 
    function ActivityDashboard(){

        const {activityStore} = useStore();
        const {loadingInitial,activityRegistry,loadActivities, setPagingParam, pagination} = activityStore
        const [loadingNext,setLoadingNext] = useState(false);

        function handleGetNext(){
            setLoadingNext(true);
            setPagingParam(new PagingParams(pagination!.currentPage+1))
            loadActivities().then(()=> setLoadingNext(false))
        }

        useEffect(()=>{
            if(activityRegistry.size <= 1 ) loadActivities();
        },[activityRegistry.size,loadActivities])

        if(loadingInitial && !loadingNext) return <LoadingComponent inverted={true} content={'Loading Activities ...'} />

        return (
            <Grid>
                <Grid.Column width="10">
                    <InfiniteScroll
                        pageStart={0}
                        loadMore={handleGetNext}
                        hasMore={!loadingNext && !!pagination && pagination.currentPage < pagination.totalPages}
                        initialLoad={false}
                    >
                        <ActivityList />
                    </InfiniteScroll>
                </Grid.Column>

                <Grid.Column width="6">
                   <ActivityFilter />               
                </Grid.Column>

                <Grid.Column width={10}>
                    <Loader active={loadingNext} />
                </Grid.Column>
            </Grid>
        )
    }
)