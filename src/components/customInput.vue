<template>
<div>
    <!-- 自定义输入框 -->
    <div class="input-box" v-on:click.stop.prevent="focus">
      <!-- 左侧标签 -->
      <p class="label">{{label}}</p>
      <!-- 右侧内容 -->
      <div class="content">
        <span class="input">
          {{val}}
        </span>
        <!-- 光标 -->
        <p class="cursor" :style="{visibility: cursor ? 'visible' : 'hidden'}"></p>
        <p class="placeholder" v-show="val.length === 0">
          {{placeholder}}&nbsp;&nbsp;
        </p>
      </div>
    </div>
    <md-number-keyboard v-model="isKeyBoardShow" type="simple" @enter="onNumberEnter" @delete="onNumberDelete"></md-number-keyboard>
  </div>
</template>
<script>
  import NumberKeyboard from 'mand-mobile/lib/number-keyboard'
  export default {
    name: 'customInput',
    components: {
      [NumberKeyboard.name]: NumberKeyboard
    },
    data () {
      return {
        cursor: false,
        label: '',
        val: '',
        placeholder: '其它',
        isKeyBoardShow: false,
        // 金额输入验证
        aIllegal: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '0..', '.'],
        inter: 5,
        decimal: 2
      }
    },
    created () {
      this.$on('handleChange', function () {
        this.blur()
        this.isKeyBoardShow = false
      })
    },
    watch: {
      isKeyBoardShow: function (newval, oldval) {
        if (!newval) {
          this.blur()
        }
      },
      val: function (newval, oldval) {
        this.$emit('delChecker', newval)
      }
    },
    methods: {
      focus () {
        this.$emit('delChecker', this.val)
        this.showKeyboard()
        this.showCursor()
        this.blinkCursor()
      },
      blur () {
        this.hideCursor()
        this.unblinkCursor()
      },
      showCursor () {
        this.cursor = true
      },
      showKeyboard () {
        this.isKeyBoardShow = true
      },
      blinkCursor () {
        clearInterval(this.intervalID)
        this.intervalID = setInterval(() => {
          this.cursor = !this.cursor
        }, 500)
      },
      hideCursor () {
        this.cursor = false
      },
      unblinkCursor () {
        clearInterval(this.intervalID)
      },
      onNumberEnter (val) {
        let oldValue = this.val
        this.val += val
        if (!this.passCheck(this.val)) {
          this.val = oldValue
          return true
        }
      },
      passCheck (val) {
        let aRules = [
          this.illegalInput,
          this.illegalValue,
          this.accuracy
        ]
        return aRules.every((item) => {
          return item(val)
        })
      },
      illegalInput (val) {
        if (this.aIllegal.indexOf(val) > -1) {
          return false
        }
        return true
      },
      illegalValue (val) {
        // eslint-disable-next-line
        if (parseFloat(val) != val) {
          return false
        }
        return true
      },
      accuracy (val) {
        let v = val.split('.')
        if (v[0].length > this.inter) {
          return false
        }
        if (v[1] && (v[1].length) > this.decimal) {
          return false
        }
        return true
      },
      onNumberDelete () {
        if (this.val === '') {
          return
        }
        this.val = this.val.substr(0, this.val.length - 1)
      }
    }
  }
</script>

<style scoped>
  .input-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    line-height: 24px;
    background-color: #fff;
  }

  .label {
    color: #333;
  }

  .content {
    display: flex;
    width: 100%;
  }

  .input {
    font-size: 16px;
    color: #313131;
    height: 46px;
    line-height: 46px;
    z-index: 99;
  }

  .cursor {
    background-color: #4788c5;
    width: 3px;
    margin-left: 4px;
    height: 25px;
    margin-top: 10px;
  }

  .placeholder {
    color: #ccc;
    line-height: 46px;
    text-align: center;
    width: 100%;
  }

  .currency {
    color: #313131;
  }

</style>
