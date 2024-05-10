import { useRouter } from 'next/router'
import BackIcon from '@mui/icons-material/ArrowBackIosNew'
import Button from '@mui/material/Button'
import { useEffect, useState } from 'react';
import Charts from "@/src/components/dashboard/Charts";

const Dashboard = () => {
  const router = useRouter();
  const [, setProjectId] = useState<number>();

  useEffect(() => {
    if (router.isReady) {
      const projectId = parseInt(router.query.projectId as string);
      setProjectId(projectId);
    }
  }, [router.isReady, router.query.projectId]);

  return(
    <div>
      <Button aria-label="戻る" onClick={() => router.back()}>
        <BackIcon />
        タスク一覧へ戻る
      </Button>
      <Charts />
    </div>
  )
}
export default Dashboard;
