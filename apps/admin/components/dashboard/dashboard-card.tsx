import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@caramella-corner/ui/components/card";

interface DashboardCardProps extends React.PropsWithChildren {
  title: string;
}

export const DashboardCard = ({ title, children }: DashboardCardProps) => {
  return (
    <Card className="min-w-max">
      <CardHeader>
        <CardTitle className="font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};
