import { IconButton } from "@mui/material";
import Image from 'next/image'
import { useEffect, useState } from "react";

const CatCommentTop = () => {
  const [catMove, setCatMove] = useState(false);
  const [displayText, setDisplayText] = useState('こんにちは！');
  const [currentMessage, setCurrentMessage] = useState('');
  const messages = [
  'こんにちは！ぼくはねこですにゃ！',
  '今日もいい天気にゃん！',
  'あなたの笑顔が大好きにゃ！',
  'お腹がペコペコにゃ〜',
  '新しい冒険を始めようにゃ！',
  '僕は夜が好きだにゃ',
  '何を考えているのかな？',
  'いつもありがとうにゃ！',
  '好奇心は最高のギフトにゃ',
  '一緒に遊ぼうにゃ！',
  'ぼくの毛玉を見つけたにゃ？',
  '今日は一緒にまったりしようにゃん！',
  '窓辺で鳥を見るのが好きにゃ',
  '夢の中でもあなたのこと考えてるにゃ',
  'お魚が食べたいにゃ〜',
  'もっと撫でてにゃん！',
  'どこかにおいしいもの隠してないにゃ？',
  '今日はどこへ行くのにゃ？',
  'ぼくのお気に入りの場所、知りたいにゃ？',
  'おやすみ、いい夢見るにゃ',
  '新しいおもちゃが欲しいにゃ〜',
  'あなたの足音が聞こえると嬉しいにゃ',
  'ぼくの尻尾、かわいいでしょにゃ？',
  'お水が飲みたいにゃん',
  'ずっと一緒にいようねにゃ',
  'ぼくのこと、撮影してにゃ？',
  'お昼寝の時間だにゃ〜',
  '今日は何して遊ぶにゃ？',
  'お気に入りの場所で一緒に寝ようにゃ',
  'あなたが大好きだにゃん！',
  '今日のご飯は何にゃ？',
  'ちょっと構ってにゃん！',
  'ぼくの鳴き声、聞こえるにゃ？',
  'あなたのそばが安心するにゃ',
  '遊び疲れたにゃ、休憩しよう',
  'お腹が空いたら声をかけてにゃ',
  '今日は何の日にゃん？',
  'お外は楽しいにゃ？',
  'ぼくの毛並み、どう思うにゃ？',
  'ちょっと探検に行こうにゃ！',
  '夜空の星、綺麗にゃん',
  'あなたと一緒に過ごす時間が好きにゃ',
  '今日は何か新しいことしようにゃ！',
  'あなたの帰りを待ってるにゃん！',
  '今日はゆっくりしようにゃ',
  '一緒に窓辺で日向ぼっこしようにゃ',
  'ぼくのお気に入りのスポット、教えるにゃ',
  'あなたの手が大好きにゃん！',
  '新しい冒険に出かけようにゃ',
  '今日も一日、楽しもうにゃ！',
  '一緒にゴロゴロしようにゃん！',
  'あなたならできるにゃ！頑張って！',
  '少しずつ進めば大丈夫にゃん！',
  '休憩も大事だにゃ、無理しないでね！',
  '一緒に頑張ろうにゃ！',
  '大変かもしれないけど、応援してるにゃ！',
  'その努力、きっと報われるにゃん！',
  'あなたは素晴らしいにゃ、諦めないで！',
  '一歩ずつ前進してるにゃ、偉いにゃ！',
  '困ったときはぼくがそばにいるにゃ！',
  '今日も一日、がんばるにゃん！',
  '目標に向かって進もうにゃ！',
  'あなたの努力、ぼくが見てるにゃ！',
  'ほら、できるにゃん！信じてるにゃ！',
  '一緒にがんばろうにゃ！',
  '何事も経験にゃん、失敗を恐れないで！',
  'ぼくのためにも、頑張ってにゃ！',
  'あなたの成功を祈ってるにゃん！',
  'ぼくがいつも応援してるにゃ！',
  'あなたならきっと大丈夫にゃん！',
  'いつもあなたのそばにいるにゃ！',
  'あなたの笑顔が見たいにゃん！',
  '一緒にがんばるにゃ！',
  'あなたの努力、きっと実るにゃん！',
  '挑戦するあなたが素敵にゃ！',
  '今日も一歩前進しようにゃん！',
  'ぼくもあなたと一緒にがんばるにゃ！',
  'あなたの強さを信じてるにゃん！',
  'ぼくの応援が届くにゃん！',
  'どんなときも諦めないでにゃ！',
  'あなたの成功、楽しみにしてるにゃ！'
  ];

  useEffect(() => {
    if (displayText.length < currentMessage.length) {
      setCatMove(true);
      const timeoutId = setTimeout(() => {
        setDisplayText(currentMessage.slice(0, displayText.length + 1));
      }, 100);
      return () => {
        clearTimeout(timeoutId);
        setCatMove(false);
      };
    }
  }, [displayText, currentMessage]);

  const handleCatClick = () => {
    const randomIndex = Math.floor(Math.random() * messages.length);
    setCurrentMessage(messages[randomIndex]);
    setDisplayText('');
  };

  const bubbleStyle = {
    margin: '10px 0',
    padding: '20px',
    borderRadius: '10px',
    border: '2px solid rgba(97, 97, 97, 0.3)',
    position: 'relative' as 'relative',
    maxWidth: '300px',
    minWidth: '100px',
  };
  const containerStyle = {
    position: 'absolute' as 'absolute',
    bottom: '15px',
    right: '15px',
    display: 'flex',
    alignItems: 'center',
  };

  const pStyle = {
    color: '#9c27b0',
  }
  return(
    <div style={containerStyle}>
      <div style={bubbleStyle}>
        <p style={pStyle}>{displayText}</p>
      </div>
      <button onClick={handleCatClick}>
        {catMove ? 
          <Image src='/catMove.gif' alt="cat" width={50} height={10}/>
          :
          <Image src='/cat.png' alt="cat" width={50} height={10}/>
        }
      </button>
    </div>

  )
}

export default CatCommentTop;
