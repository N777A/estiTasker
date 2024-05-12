import { useRouter } from 'next/router'
import ArchiveIndex from "@/src/components/task/ArchiveIndex"
import BackIcon from '@mui/icons-material/ArrowBackIosNew'
import Button from '@mui/material/Button'
import { useEffect, useState } from 'react';
import Link from 'next/link';

const Archive = () => {
  const router = useRouter();
  const [projectId, setProjectId] = useState<number>();

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
        <Link href={`../projects/${projectId}`}>タスク一覧へ戻る</Link>
      </Button>

      <ArchiveIndex />
    </div>
  )
}

export default Archive;
