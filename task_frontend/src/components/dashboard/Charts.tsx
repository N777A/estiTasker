import { Paper } from '@mui/material';
import AreaCharts from './AreaChart';
import PieChart from './PieChart';
import { Grid } from '@mui/material';
import useSections from '@/src/hooks/useSections';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Charts = () => {
  const router = useRouter();
  const { archives_count, unArchives_count, overdue_tasks_count, tasks_count, fetchArchivedTasks } = useSections();

  useEffect(() => {
    if (router && router.query.projectId) {
      const projectId = parseInt(router.query.projectId as string);
      if (!isNaN(projectId)) {
        fetchArchivedTasks(projectId);
      }
    }
  }, [router.query.projectId, fetchArchivedTasks]);
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '80%' }}>
        <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3} lg={3}>
          <Paper elevation={3} style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center'}}>
            <div style={{ fontSize: '0.8em' }}>完了したタスク</div>
            <div style={{ fontSize: '2em' }}>{archives_count}</div>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={3}>
          <Paper elevation={3} style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center'}}>
            <div style={{ fontSize: '0.8em' }}>未完了タスク</div>
            <div style={{ fontSize: '2em' }}>{unArchives_count}</div>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={3} >
          <Paper elevation={3} style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center'}}>
            <div style={{ fontSize: '0.8em' }}>期限超過タスク</div>
            <div style={{ fontSize: '2em' }}>{overdue_tasks_count}</div>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3} lg={3}>
          <Paper elevation={3} style={{ height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-around', alignItems: 'center'}}>
            <div style={{ fontSize: '0.8em' }}>合計タスク数</div>
            <div style={{ fontSize: '2em' }}>{tasks_count}</div>
          </Paper>
        </Grid>
          <Grid item xs={12}>
            <Paper elevation={3} style={{ display: 'flex', justifyContent: 'center', height: '100%', width: '100%', aspectRatio: '2 / 1' }}>
              <AreaCharts />
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper elevation={12} style={{ display: 'flex', justifyContent: 'center', height: '50%', aspectRatio: '1 / 1' }}>
              <PieChart />
            </Paper>
          </Grid>
        </Grid>
      </div>
    </div>
  )
}

export default Charts;
