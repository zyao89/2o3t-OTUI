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

export const getStyle = function(element, attr) {
    if (element.currentStyle) {
        return element.currentStyle[attr];
    }
    return getComputedStyle(element, false)[attr];
};

export const getOffsetTop = function(el) {
    let offsetTop = el.offsetTop;
    let parent = el.offsetParent;
    while (parent !== null) {
        offsetTop += parent.offsetTop;
        parent = parent.offsetParent;
    }
    return offsetTop;
};

export const getOffsetLeft = function(el) {
    let offsetLeft = el.offsetLeft;
    let parent = el.offsetParent;
    while (parent !== null) {
        offsetLeft += parent.offsetLeft;
        parent = parent.offsetParent;
    }
    return offsetLeft;
};

export const getScrollTop = function() {
    return window.scrollY || document.documentElement.scrollTop || document.body.scrollTop;
};

// 可视区域
export const getViewWidth = function() {
    return document.documentElement.clientWidth || window.innerWidth;
};

export const getViewHeight = function() {
    return document.documentElement.clientHeight || window.innerHeight;
};
