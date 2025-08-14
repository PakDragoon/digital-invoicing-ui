import React from "react"
import { ExpandIcon, DashboardIcon, SalesIcon, StatusIcon, UserIcon } from "../../../assets"
import styled from "styled-components"

interface ChartCardProps {
  title: string
  total: number
  growth?: string
  icon?: "dashboard" | "sales" | "status" | "user"
  chartComponent: React.ReactNode
}

const CardContainer = styled.div`
  width: 308px;
  height: 431px;
  background-color: #fcfcfc;
  border-radius: 6px;
  padding: 12px 16px;
  border-bottom: 1px solid rgba(1, 1, 1, 0.08);
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const IconImg = styled.img`
  width: 14.39px;
  height: 14.39px;
`

const Title = styled.div`
  font-family: "Geist", sans-serif;
  font-size: 13px;
  font-weight: 400;
  color: #666b74;
`

const IconRight = styled.img`
  width: 24px;
  height: 24px;
  padding: 10px;
`

const TotalValue = styled.div`
  font-size: 32px;
  font-weight: 600;
  color: #05b007;
  font-family: "Geist", sans-serif;
`

const Subtitle = styled.div`
  font-size: 13px;
  font-weight: 400;
  color: #666b74;
  font-family: "Geist", sans-serif;
`

const GrowthTag = styled.div`
  background-color: #c6ffd5;
  color: #05b007;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  width: fit-content;
  font-family: "Geist", sans-serif;
`

const ChartWrapper = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ChartCard: React.FC<ChartCardProps> = ({
  title,
  total,
  growth = "+5%",
  icon = "dashboard",
  chartComponent,
}) => {
  const getIconSrc = () => {
    switch (icon) {
      case "sales":
        return SalesIcon
      case "status":
        return StatusIcon
      case "user":
        return UserIcon
      default:
        return DashboardIcon
    }
  }

  return (
    <CardContainer>
      <Header>
        <HeaderLeft>
          <IconImg src={getIconSrc()} alt="icon" />
          <Title>{title}</Title>
        </HeaderLeft>
        <IconRight src={ExpandIcon} alt="expand" />
      </Header>

      <TotalValue>{total}</TotalValue>
      <Subtitle>Total {title}</Subtitle>
      <GrowthTag>{growth} ↑</GrowthTag>

      <ChartWrapper>{chartComponent}</ChartWrapper>
    </CardContainer>
  )
}

export default ChartCard
