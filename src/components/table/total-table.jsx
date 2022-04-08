import { defineComponent, h } from 'vue';
export default defineComponent({
  name: 'TableTotalRow',

  render() {
    const {
      table: { data, columns, rowKey },
      renderRows,
    } = this.$parent;
    const key = typeof rowKey === 'function' ? rowKey() : rowKey;
    const totalRow = {
      [key]: '-999999',
    };

    if (data == null || data.length <= 0) {
      columns.forEach(it => {
        const dataIndex = it.dataIndex || it.title;
        totalRow[dataIndex] = dataIndex;
      });
    } else {
      columns.forEach(column => {
        const isFunSummary = typeof column.summary === 'function';

        if (isFunSummary) {
          totalRow[column.dataIndex] = column.summary(data, h);
          return;
        }

        totalRow[column.dataIndex] =
          (column.summary &&
            data
              .map(it => {
                const val = column.summary && it[column.dataIndex];
                return typeof val === 'number' ? val : Number(val);
              })
              .reduce((prev, cur) => {
                return prev + cur;
              })) ||
          '';
      });
    }

    const totalRows = () => {
      // this.columns = columns.map(column => {
      //   const { customRender, ...rest } = column;
      //   return rest;
      // });
      return renderRows([totalRow], 0);
    };

    return (
      <tbody class="a-table-total-row">
        {this.$slots.default?.()}
        {data.length > 0 && totalRows()}
      </tbody>
    );
  },
});
