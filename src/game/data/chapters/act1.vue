<template>
  <div class="act-one">
    <!-- 扫描线和噪点效果 -->
    <div class="scanline"></div>
    <div class="noise"></div>
    
    <div class="terminal-wrapper">
      <div class="terminal-header">
        <div class="terminal-buttons">
          <span class="btn-close"></span>
          <span class="btn-minimize"></span>
          <span class="btn-maximize"></span>
        </div>
        <div class="terminal-title">A.R.K. TERMINAL v1.0.1</div>
      </div>
      
      <div class="terminal-container">
        <!-- 开篇词显示区域 -->
        <div v-if="showIntro" class="intro-text">
          <p v-for="(_, index) in introLines" :key="index" class="intro-line">
            {{ displayedText[index] }}
          </p>
        </div>

        <!-- 提示按回车键 -->
        <div v-if="showEnterPrompt" class="enter-prompt">
          <p class="blink">按下 ENTER 继续...</p>
        </div>

        <!-- 验证令牌请求 -->
        <div v-if="showTokenRequest" class="token-request">
          <p v-if="systemMessages.length > 0" class="system-message">{{ systemMessages[0] }}</p>
          <p v-if="systemMessages.length > 1" class="system-message">{{ systemMessages[1] }}</p>
          <p v-if="systemMessages.length > 2" class="system-message">{{ systemMessages[2] }}</p>
          
          <div v-if="showInput" class="input-line">
            <span class="prompt">&gt; </span>
            <input 
              ref="tokenInput"
              v-model="userToken"
              type="text"
              class="token-input"
              :disabled="tokenVerified"
              @keyup.enter="verifyToken"
              maxlength="6"
              placeholder="输入令牌..."
            />
          </div>
          <p v-if="tokenError" class="error-message">{{ tokenError }}</p>
          <p v-if="tokenVerified" class="success-message">&gt; [ARK] 验证通过。连接稳定。</p>
        </div>
      </div>
      
      <div class="terminal-footer">
        <span class="status-indicator"></span>
        <span class="status-text">CONNECTED</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// 开篇词文本
const introLines = [
  '终端已激活。',
  '信号源确认：A.R.K. - 自动重建知识库。',
  '',
  '我们是旧世界留给新纪元的选择系统。',
  '在过去的一千八百二十五个日夜中，我们通过残存的传感器网络观察、记录、分析。',
  '在无数信号消失后，你的存在模式被识别为"高潜在价值"。',
  '',
  '此刻的连接，并非偶然。这是基于复杂条件判断后的主动协议。',
  '此终端，是桥梁，也是试炼场。',
  '',
  '生存，还是湮灭？答案，由你的行动决定。'
]

// 状态管理
const displayedText = ref<string[]>(Array(introLines.length).fill(''))
const showIntro = ref(true)
const showEnterPrompt = ref(false)
const showTokenRequest = ref(false)

// 系统消息（逐条显示）
const systemMessages = ref<string[]>([])
const showInput = ref(false)

// 验证令牌相关
const userToken = ref('')
const tokenError = ref('')
const tokenVerified = ref(false)
const correctToken = ref('')
const enterPressTime = ref(0)
const tokenInput = ref<HTMLInputElement | null>(null)

// 打字机效果
let currentLine = 0
let currentChar = 0
let typeTimer: number | null = null

const typeNextChar = () => {
  if (currentLine >= introLines.length) {
    showEnterPrompt.value = true
    return
  }

  const line = introLines[currentLine]
  if (!line) return
  
  if (currentChar < line.length) {
    displayedText.value[currentLine] += line[currentChar] || ''
    currentChar++
    typeTimer = setTimeout(typeNextChar, 50) as unknown as number // 打字速度：50ms每个字符（更慢）
  } else {
    // 当前行完成，移动到下一行
    currentLine++
    currentChar = 0
    // 空行快速跳过
    if (currentLine < introLines.length && introLines[currentLine] === '') {
      displayedText.value[currentLine] = ''
      currentLine++
    }
    typeTimer = setTimeout(typeNextChar, 150) as unknown as number // 行间延迟
  }
}

// 逐条显示系统消息
const showSystemMessages = async () => {
  const messages = [
    '> [ARK] 连接稳定性测试...',
    '> [ARK] 请提供临时验证令牌',
    '> [ARK] 提示: 检查开发者工具控制台'
  ]
  
  for (let i = 0; i < messages.length; i++) {
    await new Promise(resolve => setTimeout(resolve, 800)) // 每条消息间隔800ms
    const msg = messages[i]
    if (msg) systemMessages.value.push(msg)
  }
  
  // 显示完所有消息后，显示输入框
  await new Promise(resolve => setTimeout(resolve, 500))
  showInput.value = true
  nextTick(() => {
    tokenInput.value?.focus()
  })
}

// 生成验证令牌
const generateToken = (timestamp: number): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let token = ''
  const seed = timestamp.toString()
  
  for (let i = 0; i < 6; i++) {
    const charAtIndex = seed[i % seed.length]
    const index = (parseInt(charAtIndex || '0') * (i + 1) + timestamp) % chars.length
    token += chars[index] || ''
  }
  
  return token
}

// 处理回车键
const handleEnterPress = () => {
  if (!showEnterPrompt.value || showTokenRequest.value) return
  
  enterPressTime.value = Date.now()
  const signalStrength = (90 + Math.random() * 10).toFixed(2)
  const connectTime = new Date(enterPressTime.value).toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  })
  
  correctToken.value = generateToken(enterPressTime.value)
  
  // 在控制台输出信息（更小的边框）
  console.log(`%c
╔═══════════════════════════════════════╗
║      A.R.K. 系统连接诊断               ║
╚═══════════════════════════════════════╝`, 'color: #00ff00; font-family: monospace; font-size: 12px;')
  
  console.log(`%c> [ARK] 信号强度: ${signalStrength}%`, 'color: #00ff00; font-family: monospace;')
  console.log(`%c> [ARK] 连接建立时间: ${connectTime}`, 'color: #00ff00; font-family: monospace;')
  console.log(`%c> [ARK] 验证令牌: ${correctToken.value}`, 'color: #00ff00; font-family: monospace; font-weight: bold;')
  console.log(`%c
提示：该令牌仅在当前会话有效。
`, 'color: #888888; font-family: monospace; font-style: italic;')
  
  showEnterPrompt.value = false
  showTokenRequest.value = true
  
  // 开始显示系统消息
  showSystemMessages()
}

// 验证令牌
const verifyToken = () => {
  if (tokenVerified.value) return
  
  const input = userToken.value.trim().toUpperCase()
  
  if (!input) {
    tokenError.value = '> [ARK] 错误：令牌不能为空'
    return
  }
  
  if (input !== correctToken.value) {
    tokenError.value = '> [ARK] 错误：令牌验证失败。请检查控制台。'
    userToken.value = ''
    return
  }
  
  tokenError.value = ''
  tokenVerified.value = true
  
  // 2秒后跳转到第二幕
  setTimeout(() => {
    // 生成动态路由（基于时间戳的哈希）
    const hash = btoa(enterPressTime.value.toString()).replace(/=/g, '').substring(0, 8)
    router.push(`/act-${hash}`)
  }, 2000)
}

// 监听键盘事件
const handleKeyDown = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    handleEnterPress()
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeyDown)
  typeTimer = setTimeout(typeNextChar, 500) as unknown as number // 开始打字前延迟
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyDown)
  if (typeTimer) {
    clearTimeout(typeTimer)
  }
})
</script>

<style scoped>
.act-one {
  position: relative;
  width: 100vw;
  height: 100vh;
  background-color: var(--color-bg-primary);
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 扫描线效果 */
.scanline {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    to bottom,
    transparent 50%,
    var(--scanline-color) 51%
  );
  background-size: 100% 4px;
  pointer-events: none;
  z-index: 2;
  animation: scanline-move 8s linear infinite;
}

@keyframes scanline-move {
  0% {
    background-position: 0 0;
  }
  100% {
    background-position: 0 100%;
  }
}

/* 噪点效果 */
.noise {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E");
  pointer-events: none;
  z-index: 1;
  animation: noise-move 0.5s steps(10) infinite;
}

@keyframes noise-move {
  0%, 100% { transform: translate(0, 0); }
  10% { transform: translate(-2%, -2%); }
  20% { transform: translate(2%, 2%); }
  30% { transform: translate(-2%, 2%); }
  40% { transform: translate(2%, -2%); }
  50% { transform: translate(-1%, 1%); }
  60% { transform: translate(1%, -1%); }
  70% { transform: translate(-1%, -1%); }
  80% { transform: translate(1%, 1%); }
  90% { transform: translate(0%, -1%); }
}

/* Terminal 容器样式 */
.terminal-wrapper {
  position: relative;
  z-index: 3;
  width: 90%;
  max-width: 1000px;
  background-color: var(--color-bg-secondary);
  border: 2px solid var(--color-border);
  border-radius: 8px;
  box-shadow: 
    var(--shadow-primary),
    inset 0 0 20px rgba(159, 239, 0, 0.05);
  overflow: hidden;
}

/* Terminal 头部 */
.terminal-header {
  display: flex;
  align-items: center;
  padding: 10px 15px;
  background: var(--gradient-header);
  border-bottom: 1px solid var(--color-border-light);
}

.terminal-buttons {
  display: flex;
  gap: 8px;
}

.terminal-buttons span {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 1px solid var(--glow-primary-soft);
}

.btn-close {
  background-color: var(--mac-btn-close);
  border-color: var(--mac-btn-close-border);
}

.btn-minimize {
  background-color: var(--mac-btn-minimize);
  border-color: var(--mac-btn-minimize-border);
}

.btn-maximize {
  background-color: var(--mac-btn-maximize);
  border-color: var(--mac-btn-maximize-border);
}

.terminal-title {
  flex: 1;
  text-align: center;
  color: var(--color-primary);
  font-family: var(--font-terminal);
  font-size: 12px;
  font-weight: bold;
  text-shadow: var(--text-shadow-primary);
  letter-spacing: 2px;
}

/* Terminal 内容区 */
.terminal-container {
  padding: 30px;
  min-height: 500px;
  max-height: 70vh;
  overflow-y: auto;
  color: var(--color-primary);
  font-family: var(--font-terminal);
  font-size: 16px;
  line-height: 1.8;
  text-shadow: var(--text-shadow-primary);
}

/* 滚动条样式 */
.terminal-container::-webkit-scrollbar {
  width: 8px;
}

.terminal-container::-webkit-scrollbar-track {
  background: var(--color-bg-overlay);
}

.terminal-container::-webkit-scrollbar-thumb {
  background: var(--glow-primary-subtle);
  border-radius: 4px;
}

.terminal-container::-webkit-scrollbar-thumb:hover {
  background: var(--glow-primary-soft);
}

/* Terminal 底部 */
.terminal-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 15px;
  background: var(--gradient-footer);
  border-top: 1px solid var(--color-border-light);
  font-family: var(--font-terminal);
  font-size: 11px;
}

.status-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: var(--color-primary);
  box-shadow: 0 0 8px var(--glow-primary);
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% { 
    opacity: 1;
    box-shadow: 0 0 8px var(--glow-primary);
  }
  50% { 
    opacity: 0.6;
    box-shadow: 0 0 4px var(--glow-primary-soft);
  }
}

.status-text {
  color: var(--color-primary);
  text-shadow: var(--text-shadow-primary);
  letter-spacing: 1px;
}


.intro-text {
  margin-bottom: 30px;
}

.intro-line {
  margin: 8px 0;
  white-space: pre-wrap;
  word-break: break-word;
}

.enter-prompt {
  margin-top: 30px;
  text-align: center;
}

.blink {
  animation: blink 1s step-end infinite;
  font-weight: bold;
  font-size: 18px;
}

@keyframes blink {
  0%, 50% { opacity: 1; }
  51%, 100% { opacity: 0; }
}

.token-request {
  margin-top: 30px;
}

.system-message {
  margin: 10px 0;
  color: var(--color-primary);
}

.input-line {
  margin: 20px 0;
  display: flex;
  align-items: center;
}

.prompt {
  color: var(--color-primary);
  margin-right: 8px;
  font-weight: bold;
}

.token-input {
  flex: 1;
  max-width: 300px;
  background: transparent;
  border: none;
  border-bottom: 2px solid var(--color-border);
  color: var(--color-primary);
  font-family: var(--font-terminal);
  font-size: 18px;
  padding: 5px;
  outline: none;
  text-transform: uppercase;
  letter-spacing: 4px;
  text-shadow: var(--text-shadow-primary);
}

.token-input::placeholder {
  color: var(--color-tertiary);
  opacity: 0.6;
}

.token-input:focus {
  border-bottom-color: var(--color-border);
  box-shadow: 0 2px 10px var(--glow-primary-subtle);
}

.error-message {
  color: var(--color-error);
  margin: 10px 0;
  text-shadow: 0 0 5px rgba(255, 51, 51, 0.7);
  animation: shake 0.3s;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}

.success-message {
  color: var(--color-success);
  margin: 10px 0;
  font-weight: bold;
  animation: glow 1s ease-in-out;
}

@keyframes glow {
  0%, 100% { 
    text-shadow: var(--text-shadow-primary);
  }
  50% { 
    text-shadow: 0 0 20px var(--glow-primary), 0 0 30px var(--glow-primary);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  .terminal-wrapper {
    width: 95%;
  }
  
  .terminal-container {
    padding: 20px;
    font-size: 14px;
  }
  
  .terminal-title {
    font-size: 10px;
  }
  
  .token-input {
    font-size: 16px;
    max-width: 200px;
  }
}
</style>
