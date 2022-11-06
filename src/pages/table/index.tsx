import React, { useState, useEffect } from "react";
import { View, Text } from "@tarojs/components";
import classNames from "classnames";
import "./index.less";

type ColumnProps = {
  name: string;
  dataIndex: string;
  align?: "left" | "center" | "right";
  style?: React.CSSProperties;
  className?: string;
  render?: (...args) => void;
};

type TableProps = {
  className?: string;
  headerClass?: string;
  bodyClass?: string;
  dataSource: any[];
  rowKey: string;
  column: ColumnProps[];
};

const columns: ColumnProps[] = [
  {
    name: "销售部门",
    dataIndex: "dep",
  },
  {
    name: "当前资产",
    align: "right",
    dataIndex: "current",
  },
  {
    name: "期初资产",
    align: "right",
    dataIndex: "init",
  },
  {
    name: "期间变化",
    align: "right",
    dataIndex: "change",
  },
  {
    name: "变化率",
    align: "right",
    dataIndex: "changeRate",
  },
];

const data = [
  {
    dep: "北分",
    current: "1,576",
    init: "668",
    change: "12",
    changeRate: "2.3%",
    id: "1",
  },
  {
    dep: "北分",
    current: "1,576",
    init: "668",
    change: "12",
    changeRate: "2.3%",
    id: "2",
  },
];

export default function Table(props: TableProps) {
  const {
    className,
    headerClass,
    bodyClass,
    dataSource = data,
    column = columns,
    rowKey = "id",
  } = props;

  return (
    <View className={classNames("table-wrapper", className)}>
      <View className={classNames("table-header", headerClass)}>
        <RenderHeader headerColumn={column}>
          {(cl) => {
            return (
              <View>
                <Text>{cl.name}</Text>
              </View>
            );
          }}
        </RenderHeader>
      </View>
      <View className={classNames("table-body", bodyClass)}>
        {dataSource.map((item, index) => {
          return (
            <View key={item[rowKey]}>
              <RenderHeader headerColumn={column}>
                {(cl) => {
                  return (
                    <View>
                      {cl.render ? (
                        cl.render(item[cl.dataIndex], index, item)
                      ) : (
                        <Text>{item[cl.dataIndex]}</Text>
                      )}
                    </View>
                  );
                }}
              </RenderHeader>
            </View>
          );
        })}
      </View>
    </View>
  );
}

function RenderHeader({
  children,
  headerColumn = [],
}: {
  children: (...arg) => React.ReactChild;
  headerColumn: ColumnProps[];
}) {
  return (
    <React.Fragment>
      {headerColumn.map((cl, index) => {
        return (
          <View
            key={cl.name}
            style={{
              flexBasis: 100 / headerColumn.length + "%",
              textAlign: cl.align || "left",
            }}
          >
            {children(cl)}
          </View>
        );
      })}
    </React.Fragment>
  );
}

function ExpandRow() {}
