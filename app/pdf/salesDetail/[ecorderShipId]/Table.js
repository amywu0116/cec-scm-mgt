"use client";
import { StyleSheet, Text, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  table: {},
  tableHeader: {
    display: "flex",
    flexDirection: "row",
    borderTop: "1px solid black",
    borderBottom: "1px solid black",
  },
  tableCell: {
    padding: 2,
    textAlign: "center",
  },
  dataRow: {
    display: "flex",
    flexDirection: "row",
    borderBottom: "1px solid black",
  },
});

export default function Table(props) {
  const { dataSource, columns } = props;

  return (
    <View style={styles.table}>
      <View style={styles.tableHeader}>
        {columns?.map((col, idx) => {
          return (
            <View
              key={idx}
              style={[
                {
                  width: col.width,
                  textAlign: col.align ?? "left",
                },
              ]}
            >
              <Text>{col.title}</Text>
            </View>
          );
        })}
      </View>

      <View style={styles.tableBody}>
        {dataSource?.map((d, dIdx) => {
          return (
            <View key={dIdx} style={styles.dataRow}>
              {columns?.map((col, cIdx) => {
                return (
                  <View
                    key={cIdx}
                    style={[
                      styles.tableCell,
                      {
                        width: col.width,
                        textAlign: col.align ?? "left",
                      },
                    ]}
                  >
                    {col.render ? (
                      col.render(d[col.dataIndex], d, cIdx)
                    ) : (
                      <Text>{d[col.dataIndex]}</Text>
                    )}
                  </View>
                );
              })}
            </View>
          );
        })}
      </View>
    </View>
  );
}
