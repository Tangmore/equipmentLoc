<template>
  <div id="app">
    <!--<img src="./assets/logo.png">-->
    <router-view v-if="isRouterAlive"></router-view>
  </div>
</template>

<script>
  export default {
    name: 'App',
    provide() {
      return {
        reload: this.reload
      }
    },
    data() {
      return {
        isRouterAlive: true
      }
    },
    methods: {
      reload() {
        this.isRouterAlive = false;
        this.$nextTick(function () {
          this.isRouterAlive = true
        })
      }
    }
  }
</script>

<style>

  html {
    height: 100%
  }

  body,#app{
    width: 100%;
    height: 100%;
    font-size: 0.18rem;
    font-weight: normal;
    font-family: "Microsoft YaHei";
    margin: 0;
    padding: 0;
    /* background: #050426; */
    /* background-image: radial-gradient(circle closest-side,#041e43,#040f1c); */
    background: url("~@/assets/img/bgi.png") no-repeat;
    background-size: 100% 100%;
  }

  a {
    text-decoration: none;
  }

  ul {
    list-style-type: none;
    margin: 0;
    padding: 0;
  }

  li {
    list-style-type: none;
  }

  input[type='text'] {
    background: none;
    border: 1px solid #144470;
    color: #8fb2cc;
    font-size: 0.18rem;
    -moz-appearance: none; /* Firefox */
    -webkit-appearance: none; /* Safari 和 Chrome */
  }

  input[type='password'] {
    background: none;
    border: 1px solid #144470;
    -moz-appearance: none; /* Firefox */
    -webkit-appearance: none; /* Safari 和 Chrome */
  }

  .el-textarea__inner{
    height: 100px;
    background: none;
    border: 1px solid #144470;
    -moz-appearance: none; /* Firefox */
    -webkit-appearance: none; /* Safari 和 Chrome */
  }
  .el-checkbox__inner{
    background: none;
    border: 1px solid #ccc;
    -moz-appearance: none; /* Firefox */
    -webkit-appearance: none; /* Safari 和 Chrome */
  }

  .el-pagination {
    display: flex;
  }

  .el-pager {
    display: flex;
  }

  .el-pager li {
    box-sizing: border-box;
    border-top: 1px solid #0c2e64;
    border-bottom: 1px solid #0c2e64;
    border-right: 1px solid #0c2e64;
    color: #6889a9;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin: 0;
    background: none;
    font-size: 12px;
  }

  .el-pagination.is-background .btn-next, .el-pagination.is-background .btn-prev, .el-pagination.is-background .el-pager li {
    background: none;
    margin: 0;
    border-top: 1px solid #0c2e64;
    border-bottom: 1px solid #0c2e64;
    border-right: 1px solid #0c2e64;
    color: #6889a9;
    background: none;
  }

  .el-pagination.is-background .el-pager li:hover {
    background: none;
    color: #00aaff;
    font-weight: normal;
  }

  .el-pager li:first-child {
    border-left: 1px solid #0c2e64;
    width: 50px;
  }

  .el-pager li:last-child {
    width: 50px;
  }

  .el-select {
    width: 120px;
  }

  .el-icon-arrow-up:before {
    color: #ffffff;
  }
  .el-select-dropdown {
    background: #e6eef5;
    border: 1px solid #144470;
  }

  .el-select-dropdown__item {
    color: #61839d;
  }

  .el-select .el-input__inner {
    background: none;
    border: 1px solid #144470;
    color: #ffffff;
  }
  .el-select-dropdown__item.hover, .el-select-dropdown__item:hover {
    background-color: rgba(4,30,67,1) !important;
  }

  .el-select .el-select-dropdown__item {
    background: #144470;
  }

  .mobile-area-option{
    background:radial-gradient(circle,rgba(5,15,28,1),rgba(4,30,67,1));
    border: none;
    box-shadow: 0 0 3px #05b2ff;
  }
  .el-popper[x-placement^=top] .popper__arrow::after {
    bottom: 1px;
    margin-left: -6px;
    border-top-color: rgba(4,30,67,1) !important;
    border-bottom-width: 0;
  }
  .mobile-area-option .el-scrollbar{
    height: auto;
    max-height: 150px;
    overflow: scroll;
  }
  .mobile-area-option .el-scrollbar::-webkit-scrollbar {
      display: none;
  }
  .el-input .el-input--suffix {
    background: none;
  }

  .el-checkbox__label {
    color: #8fb2cc;
  }

  .el-form-item__label {
    color: #8fb2cc;
  }

  .el-image__error {
    background: none;
    color: #778ec7;
  }

  .el-menu {
    background: none;
    border: none;
  }

  input {
    -moz-appearance: none; /* Firefox */
    -webkit-appearance: none; /* Safari 和 Chrome */
  }

  .el-scrollbar {
    height: 100%;
    /* padding-bottom: 20px */
  }

  .el-scrollbar__wrap {
    overflow-x: hidden;
  }

  .el-scrollbar__wrap {
    overflow-x: hidden;
  }

  .el-scrollbar__bar.is-vertical {
    width: 0px;
  }

  .el-scrollbar__wrap.default-scrollbar__wrap {
    overflow-x: auto;
  }

  .el-dialog__wrapper {
    height: 100%;
  }

  .el-dialog, .el-pager li {
    background: none;
  }

  /*  .el-dialog, .el-pager li:after{
      background: #142c52;
      opacity: 0.7;
      content: '';
      width: 100%;
      height: 100%;
      position: absolute;
      background: -webkit-gradient(linear, left top, left bottom, from(#0b2b58), to(#0d1940));
      background: linear-gradient(#0b2b58, #0d1940);
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      z-index: -1;
    }*/
  .el-dialog {
    width: 80%;
    height: 40%;
    border: 1px solid #4f7ea9;
    background: #071429;
    opacity: 0.6;
  }
  .el-dialog:after {

  }

  .el-dialog__headerbtn .el-dialog__close {
    color: #ffffff;
  }

  .el-dialog__title {
    line-height: 24px;
    font-size: 18px;
    color: #f6f7f9;
  }

  .el-tooltip__popper {
    line-height: 0.3rem;
    font-size: 0.14rem;
  }
  .el-tooltip__popper.is-dark {
    background:rgba(26,66,118,0.7) !important;
    border:1px solid rgba(101,198,231,1);
    font-size:0.14rem;
    font-family:Microsoft YaHei;
    font-weight:400;
    color:rgba(255,255,255,1);
  }
  .el-tooltip__popper[x-placement^=top] .popper__arrow{
    border-top-color: rgba(101,198,231,1) !important;
  }
  .el-tooltip__popper[x-placement^=top] .popper__arrow::after{
    bottom:1px;
    margin-left:-5px;
    border-top-color:rgba(101,198,231,1);
    border-bottom-width:0
  }
  .el-card {
    background: none;
    color: #fff;
    -webkit-transition: .3s;
    transition: .3s;
    border: none;
  }

  .water-node .el-timeline-item__node--normal{
    width: 12px;
    height: 12px;
    border-radius: 80% 0 55% 50% / 55% 0 80% 50%;
    transform: rotate(-225deg);
  }
  .water-has  .el-timeline-item__node{
     background-image: radial-gradient(circle closest-side,#a1a1a1,#676767);
  }
  .water-cur  .el-timeline-item__node{
     background-image: radial-gradient(circle closest-side,#2eacdc,#51ffff);
  }
  .water-warn  .el-timeline-item__node{
     background-image: radial-gradient(circle closest-side,#cf5b44,#8e3929);
  }
  .el-timeline-item__node {
    position: absolute;
    background-image: radial-gradient(circle closest-side,#2eacdc,#51ffff);
    border-radius: 50%;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
  }

  .el-timeline-item__tail {
    position: absolute;
    left: 4px;
    height: 100%;
    border-left: 2px solid rgba(82,255,255,.2);
  }

  .el-card.is-always-shadow, .el-card.is-hover-shadow:focus, .el-card.is-hover-shadow:hover {
    box-shadow: 0 0px 0px 0 #218cd9;
  }

  .el-card, .el-message {
    border-radius: 0;
  }

  .el-card__body {
    padding: 0;
  }
  .el-dialog__body{
    display: flex;
    justify-content: center;
    height: 80%;
  }
  .el-tabs--border-card{
    background: none;
    border:none
  }
  .el-tabs--border-card>.el-tabs__header{
    border-bottom: 1px solid #218cd9;
    background: none;
  }
  .el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active{
    color: #ffffff;
    background-color: #061e4c;
    border-right-color: #218cd9;
    border-left-color: #218cd9;
  }
  [class*=" el-icon-"], [class^=el-icon-]{
    color: #ffffff;
  }
  .el-transfer-panel .el-transfer-panel__footer {
    height: 40px;
    background: #FFF;
    margin: 0;
    padding: 0;
    border-top: 1px solid #EBEEF5;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    z-index: 1;
    display: flex;
    justify-content: center;
  }

</style>
