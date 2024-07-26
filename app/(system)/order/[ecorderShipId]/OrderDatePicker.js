import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";

import DatePicker from "@/components/DatePicker";

dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export default function OrderDatePicker(props) {
  const { ecorderDate } = props;

  // 只能選擇大於等於訂單日期且小於等於今天的日期
  const disabledDate = (current) => {
    const today = dayjs();
    return !(
      current.isSameOrAfter(ecorderDate) && current.isSameOrBefore(today)
    );
  };

  return <DatePicker {...props} disabledDate={disabledDate} />;
}
