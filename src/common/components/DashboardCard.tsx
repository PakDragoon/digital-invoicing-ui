import React from "react"
import { Box, Typography } from "@mui/material"

interface DashboardCardProps {
  title: string
  totalValue: string
  growth?: string
  growthColor?: string
  children: React.ReactNode
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  title,
  totalValue,
  growth = "",
  growthColor = "#01B802",
  children,
}) => {
  return (
    <Box
      sx={{
        width: 418,
        height: 431,
        padding: "16px",
        backgroundColor: "#fff",
        borderRadius: "6px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        marginLeft: "80px",
      }}
    >
      <Typography
        sx={{
          fontSize: "24px",
          fontWeight: 700,
          color: "#01B802",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {totalValue}
      </Typography>

      <Typography
        sx={{
          fontSize: "14px",
          fontWeight: 500,
          color: "#6F6F76",
          fontFamily: "Inter, sans-serif",
        }}
      >
        {title}
      </Typography>

      {growth && (
        <Box
          sx={{
            backgroundColor: "#D7FFD7",
            color: growthColor,
            fontWeight: 600,
            fontSize: "12px",
            padding: "4px 8px",
            borderRadius: "4px",
            display: "inline-flex",
            alignItems: "center",
            gap: "4px",
            width: "fit-content",
            fontFamily: "Inter, sans-serif",
          }}
        >
          {growth} ↑
        </Box>
      )}

      {/* Chart or content injected here */}
      <Box sx={{ flex: 1 }}>{children}</Box>
    </Box>
  )
}

export default DashboardCard
