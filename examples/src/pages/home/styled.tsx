import styled from "styled-components";

export const MainTitle = styled.h1`
  text-align: center;
  font-size: 32px;
  line-height: 80px;
  margin: 0;
`;

export const TodayRiskNumberWrapper = styled.div`
  height: 214px;
  background: #f2f7fe;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  span.title {
    font-size: 24px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(0, 0, 0, 0.65);
    line-height: 33px;
  }
`;

export const TodayRiskValueWrapper = styled.div`
  margin-top: 18px;
  span.value {
    display: inline-block;
    width: 43px;
    height: 62px;
    margin-right: 8px;
    background: #0074e9;
    border-radius: 4px;

    font-size: 48px;
    font-family: PingFangSC-Semibold, PingFang SC;
    font-weight: 600;
    color: #ffffff;
    line-height: 62px;
    text-align: center;
  }
`;
