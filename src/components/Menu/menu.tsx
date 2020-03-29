import React, {
  Component,
  CSSProperties,
  createContext,
  useState,
  ReactNodeArray
} from "react";
import classNames from "classnames";

import { IItemProps } from "./item";

// 导航的模式 水平或者垂直
type MenuMode = "vertical" | "horizontal";
// 点击选中事件的类型
type selectFuncType = (selectedIndex: number) => void;

export interface IMenuProps {
  className?: string;
  mode?: MenuMode;
  style?: CSSProperties;
  onSelect?: selectFuncType;
  defaultIndex?: number;
}

type contextProps = {
  index: number;
  onSelect?: selectFuncType;
};

export const MenuContext = createContext<contextProps>({
  index: 0
});

// 渲染填充索引并过滤子组件，  
const renderChildren = (children:any) => {
  const childs = React.Children.map(children, (child, ind) => {
    const childElement = child as React.FunctionComponentElement<IItemProps>;
    if (childElement.type.displayName === "menu-item") {
      return React.cloneElement(childElement, {
        index: ind
      });
    } else {
      console.error("使用menu 组件请在子组件填充 menu-item 组件 。。。");
    }
  });

  return childs 
};

const Menu: React.FC<IMenuProps> = props => {
  const { className, mode, style, onSelect, defaultIndex, children } = props;
  const [current, setCurrentItem] = useState(defaultIndex);
  const classes = classNames("menu", className, {
    "menu-horizontal": mode === "horizontal"
  });

  // 创建出这个上下文 ， 提供给子组件进行调用  
  const providerData: contextProps = {
    index: typeof current === "undefined" ? 0 : current,
    onSelect: selectedIndex => {
      setCurrentItem(selectedIndex);
      if (onSelect) {
        onSelect(selectedIndex);
      }
    }
  };

  const childs = renderChildren(children)

  return (
    <ul className={classes} style={style} data-testid="test-menu">
      <MenuContext.Provider value={providerData}>{childs}</MenuContext.Provider>
    </ul>
  );
};

Menu.defaultProps = {
  mode: "vertical",
  defaultIndex: 0
};

export default Menu;
