"use client";
import { StyleSheet, Text, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  table: {},
  tableHeader: {
    borderTop: "0.5px solid #000",
    borderBottom: "0.5px solid #000",
    padding: "1px 0",
  },
  tableHeaderInner: {
    borderTop: "0.5px solid #000",
    borderBottom: "0.5px solid #000",
    display: "flex",
    flexDirection: "row",
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
        <View style={styles.tableHeaderInner}>
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