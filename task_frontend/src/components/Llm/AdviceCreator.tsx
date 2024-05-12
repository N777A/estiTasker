import { Button, CircularProgress, IconButton, Modal, Tooltip } from "@mui/material"
import InfoIcon from '@mui/icons-material/Info';
import { TaskType } from "@/src/types/Task";
import { UniqueIdentifier } from "@dnd-kit/core";
import { useEffect, useRef, useState } from "react";
import { useLlm } from "@/src/hooks/useLlm";
import useSections from '@/src/hooks/useSections';
import { AdviceType } from "@/src/types/Advice";
import Dialog, { DialogProps } from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';

type AdviceCreatorProps = {
  task: TaskType;
};


const AdviceCreator = ({ task }: AdviceCreatorProps) => {
  const [isCreating, setIsCreating] = useState(false);
  const [advice, setAdvice] = useState<AdviceType[]>([]);
  const { adviceTask } = useLlm;
  const { addAdvice, fetchAdvices, advices} = useSections();
  const [scroll, setScroll] = useState<DialogProps['scroll']>('paper');
  const [open, setOpen] = useState(false)
  const modalStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    outline: 'none',
  };

  const handleClick = async () => {
    try{
      setIsCreating(true)
      const formatInfo = { title: task.title, description: task.description }
      const formatInfoString = JSON.stringify(formatInfo);
      const res = await adviceTask(formatInfoString)
      if (!res || !res.data) {
        throw new Error('APIからの応答がnullです');
      }
      const aiAdvices = res.data.advice
   
      const newAdvices: AdviceType[] = aiAdvices.map((aiAdvice: { advice: string })  => ({
        id: -1,
        advice_text: aiAdvice.advice,
        task_id: task.id
      }))
      await Promise.all(newAdvices.map(modefiedAdvice => addAdvice(task.id, modefiedAdvice)))
      setIsCreating(false)

    } catch (err) {
      console.error('アドバイスの作成に失敗', err)
    }
  }

  const handleClickOpen = async (scrollType: DialogProps['scroll']) => {
    setOpen(true);
    setIsCreating(true);
    await fetchAdvices(task.id);
    setIsCreating(false);
  };

  useEffect(() => {
    if (advices.size > 0) {
      const adviceArray = Array.from(advices.values())
        .filter(a => a.task_id === task.id)
        .map(advice => ({ ...advice, task_id: task.id }));
      setAdvice(adviceArray);
    } else {
      setAdvice([]);
    }
  }, [advices, task.id]);
  
  const handleClose = () => {
    setOpen(false)
  }

  const descriptionElementRef = useRef<HTMLElement>(null);
  useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <>
      <Tooltip title='タスクに関連するアドバイス'>
        <IconButton
          onClick={() => handleClickOpen('paper')}
        >
          <InfoIcon />
        </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
        style={modalStyle}
      >
        <DialogTitle id="scroll-dialog-title">
          {
            <>
              <p>{task.title}</p>
              <Tooltip title='タスクに関連するアドバイスを生成'>
                <IconButton
                  onClick={handleClick}
                  color='secondary'
                >
                  <AutoAwesomeIcon fontSize="large"/>
                </IconButton>
              </Tooltip>
            </>
          }
        </DialogTitle>
        <DialogContent
          dividers={scroll === 'paper'}
          ref={descriptionElementRef}
          tabIndex={-1}
        >
          {advice.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {advice.map((adv, index) =>
                <li
                  key={index}
                  style={{
                    marginBottom: '20px',
                    color: '#1e88e5',
                    fontSize: '1.12rem',
                  }}
                >
                  □  {adv.advice_text}
                </li>
              )}
            </ul>
          ) : (
            'アドバイスはまだありません。アドバイスが必要な場合は上部の生成ボタンをクリックしてください。'
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>閉じる</Button>
        </DialogActions>
      </Dialog>

      {isCreating && (
        <Modal open={isCreating} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={modalStyle}>
            <CircularProgress color="secondary" />
          </div>
        </Modal>
      )}
    </>
  )
}

export default AdviceCreator;


