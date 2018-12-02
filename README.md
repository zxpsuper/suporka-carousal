## suporka-carousal

suporka-carousal is a carousal plugin for web.

You can use it to make a carousal easier than by yourself writtinng.

## Usage
```js
// install the plugin
npm install suporka-carousal

```

[Demo](https://zxpsuper.github.io/Demo/carousal/)

```html
<div id="carousal">

  <!-- left buttton -->
  <button type="button" class="suporka-carousel__arrow suporka-carousel__arrow--left" style="" id="suporka-prev-btn">&lt;</button>
  <div id="wrapper">
    <div class="box">
      <img src="http://h5.sztoda.cn/static/img/loveLetter/teacher/teacher1.jpg" alt="">
    </div>
    <div class="box">
      <img src="http://h5.sztoda.cn/static/img/loveLetter/teacher/teacher2.jpg" alt="">
    </div>
    <div class="box">
      <img src="http://h5.sztoda.cn/static/img/loveLetter/teacher/teacher3.jpg" alt="">
    </div>
    <div class="box">
      <img src="http://h5.sztoda.cn/static/img/loveLetter/teacher/teacher4.jpg" alt="">
    </div>
  </div>
  <!-- right button -->
  <button type="button" class="suporka-carousel__arrow suporka-carousel__arrow--right" style="" id="suporka-next-btn">&gt;</button>

  <!-- dot dom -->
  <div id="suporka-dot">
    <span></span>
    <span></span>
    <span></span>
    <span></span>
  </div>
</div>

```
```js
// import carousal in js
import Carousal from 'suporka-carousal'
new Carousal(option)

// or use it by script tag
<script src="https://cdn.jsdelivr.net/npm/suporka-carousal@1.0.1/carousal.js"></script>
<script>
  new Carousal(option)
</script>
```

## option

type: Object

| attr        | default    |  description  |
| :----:   | :----:   | :----: |
| time        | 4000     |   the slider time(ms)  of carousal|
| transition        | 0.8      |   transition time(s)    |
| autoScroll        | true     |   if auto scroll    |

## Questions

If you have some questionn, you can send me a E-mail(zxpscau@163.com).