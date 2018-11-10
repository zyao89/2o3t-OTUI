export const scrollAnimation = function scrollAnimation(currentY, targetY, ele = window) {
    // 计算需要移动的距离
    const needScrollTop = targetY - currentY;
    let _currentY = currentY;
    setTimeout(() => {
        // 一次调用滑动帧数，每次调用会不一样
        const dist = Math.ceil(needScrollTop / 10);
        _currentY += dist;
        ele.scrollTo(_currentY, currentY);
        // 如果移动幅度小于十个像素，直接移动，否则递归调用，实现动画效果
        if (needScrollTop > 10 || needScrollTop < -10) {
            scrollAnimation(_currentY, targetY, ele);
        } else {
            ele.scrollTo(_currentY, targetY);
        }
    }, 10);
};

