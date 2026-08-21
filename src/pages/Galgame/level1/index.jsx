import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import img1 from '../assets/xiao/1.jpg'
import img2 from '../assets/xiao/2.jpg'
import img3 from '../assets/xiao/3.jpg'
import img4 from '../assets/xiao/4.jpg'
import img5 from '../assets/xiao/5.jpg'
import img9 from '../assets/xiao/9.jpg'
import img10 from '../assets/xiao/10.jpg'

function Level1() {
  const navigate = useNavigate()
  
  // ==================== 场景数据 ====================
  const scenes = {
    scene1: {
      background: img1,
      dialogues: [
        '"若只如初见"',
        '我“哇，这个背影好帅呀，要是能和他交个朋友就好了（内心狂喜）”',
        '慢步走上前去，想和他打声招呼',
        '嘎吱～（踩到树枝）',
        '他：“谁在那儿？”',
        '我：“啊......我......（紧张）”',
        '他头也不回的问道：“ni cai wa zou sa nie”'
      ],
      choices: [
        { 
          text: '夸奖他',
          responses: [
            '我：“我觉得你非常有气质，可以和我共进晚餐么（小心翼翼，两只小手轻轻地捏着裙褶）”',
            '他：”当然可以了小妹妹～（超绝气泡音夹杂着门牙上的韭菜味）“',
            '我捂着樱桃小嘴偷偷地笑（其实是被熏到了）'
          ],
          next: 'scene2' 
        },
        { text: '转身逃跑', next: 'scene10' }
      ]
    },

    scene2: {
      background: img2,
      dialogues: [
        '他：“快吃吧小妹妹，哥哥给你点了小火锅还有好多饮料”',
        '“吃完后就该吃你了小宝贝（小声嘀咕）”',
        '我：“啊...？（疑惑）”',
        '他：“哈哈没事没事”'
      ],
      choices: [
        { 
          text: '继续夸奖', 
          responses: [
            '我：“你真的很帅，我从来没有见过像你这样的人”',
            '他：“没关系的，金子发的光是遮不住的（得意）”',
            '我：（尴尬一笑）',
            '他：“你的笑像我命中的毒药，迷的我无法自拔（仰天长啸）”',
            '“天色还早，哥哥带你去看电影好不好”'
          ],
          followUpChoices: [
            { text: '答应', responses: ['我：“好呀好呀”'], next: 'scene3' },
            { text: '拒绝', next: 'scene10' }
          ]
        },
        { 
          text: '沉默',
          responses: [
            '我：“......”',
            '他："（恼羞成怒）你什么意思啊小妹妹儿～，难道是嫌弃我吗？"'
          ],
          followUpChoices: [
            { 
              text: '解释', 
              responses: [
                '我：“不是的不是的（连忙摇手），帅哥，我只是有点害羞”',
                '“这么帅气的小男孩坐在面前，是个人都会害羞吧”',
                '他：“（冷笑）”',
                '“既然这样，那哥哥就勉为其难原谅你吧”',
                '“毕竟我肚肚大么，再不听话，哥哥就要打你的小屁屁咯，呵呵哈哈（酱香老钱笑）”',
                '我：（尴尬）',
                '他：“小妹妹儿～，哥哥带你去看电影吧”'
              ],
              followUpChoices: [
                { text: '答应', responses: ['我：“嗯好吧...”','他：“嘿嘿嘿，这就对么😋”'], next: 'scene3' },
                { text: '拒绝', next: 'scene10' }
              ]
            },
            { text: '离开', next: 'scene10' }
          ]
        }
      ]
    },
    
    scene3: {
      background: img3,
      dialogues: [
        '汽车来回摇晃，我不小心碰到了他的肩膀',
        '他：“小妹妹儿～，你怎么啦？（关切）”',
        '我：“没事没事（内心os：好尴尬呀，这个司机开车不稳当（小鹿乱撞））”',
        '他：“司机麻烦你开慢点，我妹妹有点不舒服～（超绝气泡音并看向了我）”',
        '“没关系的小妹儿～，不舒服就要跟我说哦（举起胳膊展示黑森林）”',
        '我：“啊...（脸红）”',
        '他：“哦？到了，我们下车吧（拽着我的小手手）”'
      ],
      choices: [{ text: '继续', next: 'scene4' }]
    },

    scene4: {
      background: img4,
      dialogues: [
        '我内心os：明明是来看电影的，为什么我只想看着他呢（小鹿乱撞）',
        '他忽然转过头，盯着我看了一会',
        '我害羞的低下了头，两只小手紧张的搓着垢夹',
        '他用食指抵着我的下巴，轻轻地抬起来我的小头',
        '“哦？我的小公主怎么了？”他戏弄般地看着我',
        '我惊慌失措地逃出影院'
      ],
      choices: [{ text: '继续', next: 'scene5' }]
    },

    scene5: {
      background: img5,
      dialogues: [
        '他追上来问我',
        '“宝宝你怎么了，有问题就说出来，我帮你解决（担心）”'
      ],
      choices: [
        { 
          text: '解释', 
          responses: [
            '我：“我...我......”',
            '"お兄ちゃん、実はあなたのことが好きです（大声宣泄）"',
            '他：“你说什么？（惊讶）”',
            '我：“自从我见你的那一刻起，我就知道你是我命中注定的人”',
            '“请和我交往吧（喜悦）”',
            '他：“いもうと，我也喜欢你”',
            '我：“真的吗？（惊喜）”',
            '他：“当然是真的，我的妹妹（小声）”',
            '"我家猫😺会后空翻，我带你去看吧"'
          ],
          followUpChoices: [
            { text: '答应', responses: ['我：“真的吗？欧尼酱好厉害呀”','他：“当然啦，我的妹妹”'], next: 'scene9' },
            { text: '拒绝', responses: ['我：“算了吧哥哥，我家里还有点事，我还要赶回去呢”'], next: 'scene10' } 
          ]
        },
        { text: '离开', responses: ['我：“你做事好强硬啊，可不可以收敛一点呀”'], next: 'scene10' }      
      ]
    },

    scene9: {
      background: img9,
      dialogues: [
        '他：“其实我...(支支唔唔)”',
        '“其实我是0！！！”',
        '我：“啊？（惊讶）”',
        '他：“我知道你可能会有点失望，但是我希望你能接受我”',
        '我：“没关系的，我喜欢你就好”',
        '他：“真的吗？（惊讶）”',
        '我：“当然是真的，我的哥哥”',
        '他：“我也喜欢你，我的妹妹（小声）”',
        '他愉悦地🍀死了我',
        '你成功了，游戏通关!!!'
      ],
      choices: []
    },

    scene10: {
      background: img10,
      dialogues: [
        '他：“你什么意思啊喂？！（怒目圆睁）”',
        '伪人小把我推倒在地上',
        '我："不要啊我只有一个洞（恐惧）"',
        '他："哼哼（冷笑），就喜欢一个洞的"',
        '他愤怒地🍀死了我',
        '你失败了，游戏结束!!!'
      ],
      choices: []
    }
  }
  
  // ==================== 游戏状态 ====================
  const [currentScene, setCurrentScene] = useState('scene1')
  const [dialogueIndex, setDialogueIndex] = useState(0)
  const [showChoices, setShowChoices] = useState(false)
  const [responses, setResponses] = useState([])
  const [responseIndex, setResponseIndex] = useState(0)
  const [pendingNext, setPendingNext] = useState(null)
  const [activeChoices, setActiveChoices] = useState([])

  const scene = scenes[currentScene]

  // ==================== 点击对话框 ====================
  const handleDialogueClick = () => {
    console.log('========== 点击对话框 ==========')
    console.log('responses长度:', responses.length)
    console.log('responseIndex:', responseIndex)
    console.log('activeChoices长度:', activeChoices.length)
    console.log('pendingNext:', pendingNext)
    
    if (responses.length > 0) {
      if (responseIndex < responses.length - 1) {
        setResponseIndex(responseIndex + 1)
      } else {
        if (activeChoices.length > 0) {
          console.log('→ 显示后续选项')
          setShowChoices(true)
          setPendingNext(null)
        } else if (pendingNext) {
          console.log('→ 跳转场景:', pendingNext)
          setCurrentScene(pendingNext)
          setDialogueIndex(0)
          setShowChoices(false)
          setResponses([])
          setResponseIndex(0)
          setPendingNext(null)
          setActiveChoices([])
        }
      }
      return
    }

    if (dialogueIndex < scene.dialogues.length - 1) {
      setDialogueIndex(dialogueIndex + 1)
    } else if (scene.choices.length > 0) {
      setActiveChoices(scene.choices)
      setShowChoices(true)
    }
  }

  // ==================== 点击选项 ====================
  const handleChoice = (choice) => {
    console.log('========== 点击选项 ==========')
    console.log('选项文字:', choice.text)
    console.log('next:', choice.next)
    console.log('responses:', choice.responses)
    console.log('followUpChoices:', choice.followUpChoices)
    
    setActiveChoices(choice.followUpChoices || [])
    
    if (choice.responses && choice.responses.length > 0) {
      setResponses(choice.responses)
      setResponseIndex(0)
      setPendingNext(choice.next || null)
      setShowChoices(false)
    } else {
      setCurrentScene(choice.next)
      setDialogueIndex(0)
      setShowChoices(false)
      setActiveChoices([])
      setResponses([])
      setResponseIndex(0)
      setPendingNext(null)
    }
  }

  // 当前显示的文字
  const currentText = responses.length > 0 
    ? responses[responseIndex] 
    : scene.dialogues[dialogueIndex]

  // ==================== 页面渲染 ====================
  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundImage: `url(${scene.background})`,
      backgroundSize: 'auto 100%',
      backgroundPosition: '50% 20%',
      backgroundRepeat: 'no-repeat',
      zIndex: 1000,
      display: 'flex',
      flexDirection: 'column'
    }}>
      
      <div style={{ padding: '20px' }}>
        <button
          onClick={() => navigate('/galgame')}
          style={{
            background: 'rgba(100, 180, 255, 0.8)',
            color: '#fff',
            border: 'none',
            padding: '6px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          ← 返回
        </button>
      </div>

      <div style={{ flex: 1 }} />

      <div
        onClick={handleDialogueClick}
        style={{
          position: 'absolute',
          bottom: '70px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '80%',
          maxWidth: '1200px',
          background: 'rgba(0, 0, 0, 0.75)',
          border: '2px solid #555',
          borderRadius: '10px',
          padding: '20px',
          minHeight: '240px',
          color: '#fff',
          fontSize: '22px',
          textAlign: 'left',
          cursor: 'pointer',
          userSelect: 'none',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}
      >
        <p style={{
          margin: 0,
          wordBreak: 'break-word',
          whiteSpace: 'normal',
          overflowWrap: 'break-word'
        }}>
          {currentText}
        </p>

        {showChoices && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            marginTop: '20px'
          }}>
            {activeChoices.map((choice, index) => (
              <button
                key={index}
                onClick={(e) => {
                  e.stopPropagation()
                  handleChoice(choice)
                }}
                style={{
                  padding: '12px 20px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#fff',
                  border: '1px solid #666',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  textAlign: 'left',
                  width: 'fit-content'
                }}
              >
                {choice.text}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Level1