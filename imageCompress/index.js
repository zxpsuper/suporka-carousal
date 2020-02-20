import ImageCompress from './imageCompress-dev';

new ImageCompress({
    file:
        'https://user-gold-cdn.xitu.io/2017/11/13/15fb50927c2cceba?imageView2/0/w/1280/h/960/format/webp/ignore-error/1',
    width: 500,
    quality: 1,
    mimeType: 'image/jpeg',
})
    .then(instance => {
        // 获取canvas，可用于自行加工绘制
        let canvas = instance.getCanvas();
        let context = canvas.getContext('2d');
        context.moveTo(100, 100);
        context.lineTo(50, 50);
        context.stroke();

        // 替换文档中存在图片节点
        instance.replaceImageNode(document.getElementById('img'));
        // 替换文档中存在的canvas节点
        instance.replaceCanvasNode(document.getElementById('canvas'));
        // 获取压缩后生成的image节点
        // instance.getCompressImageNode().then(image => {
        //   console.log(image)
        // });

        // // 获取压缩后的blob文件，可用于上传
        instance.getCompressFile().then(blob => {
           
            

        });
        // 获取图片base64
        let base64 = instance.getImageBase64();
        // 下载压缩后文件
        // instance.downloadCompressFile();
    })
    .catch(err => {
        console.log(err);
    });

window.changeFile = function(event) {
    let file = event.target.files[0];
    console.log(typeof file, file)
    new ImageCompress({
        file,
        width: 500,
        quality: 1,
        mimeType: 'image/jpeg',
    })
        .then(instance => {
            // 获取canvas，可用于自行加工绘制
            let canvas = instance.getCanvas();
            let context = canvas.getContext('2d');
            context.moveTo(100, 100);
            context.lineTo(50, 50);
            context.stroke();

            // 替换文档中存在图片节点
            instance.replaceImageNode(document.getElementById('img'));
            // 替换文档中存在的canvas节点
            instance.replaceCanvasNode(document.getElementById('canvas'));
            // 获取压缩后生成的image节点
            instance.getCompressImageNode().then(image => {
              console.log(image)
            });

            let base64 = instance.getImageBase64()
            console.log(base64)
            // // 获取压缩后的blob文件，可用于上传
            // instance.getCompressFile().then(blob => {
            //     console.log('blob', blob);
            // });
            // 下载压缩后文件
            // instance.downloadCompressFile();
        })
        .catch(err => {
            console.log(err);
        });
};
