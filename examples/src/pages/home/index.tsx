import { memo } from "react";
import { MainTitle, TodayRiskNumberWrapper, TodayRiskValueWrapper } from "./styled";

function Home() {
  return (
    <>
      <MainTitle>首页</MainTitle>
      <TodayRiskNumberWrapper>
        <span className="title">卡片</span>
        <TodayRiskValueWrapper>
          <span className="value">1</span>
          <span className="value">1</span>
          <span className="value">1</span>
          <span className="value">1</span>
        </TodayRiskValueWrapper>
      </TodayRiskNumberWrapper>
    </>
  );
}

export default memo(Home);
