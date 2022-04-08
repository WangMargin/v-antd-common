import { ref, reactive, watch } from 'vue';
export const useTableDynamicColumns = (columns, checkAll = true) => {
  const state = reactive({
    checkAll: true,
    checkedList: [],
    indeterminate: true,
  });
  const dynamicColumns = ref(columns);
  const dynamicColumnItems = ref(
    columns.map(column => {
      return {
        key: column?.key || column.dataIndex,
        label: column.title,
        checked: checkAll,
      };
    }),
  );
  const dynamicColumnValues = dynamicColumnItems.value.map(column => column.key);
  state.checkedList = dynamicColumnValues;
  state.checkAll = checkAll;
  state.indeterminate = !checkAll;

  const planColumns = () => {
    const keys = dynamicColumnItems.value.map(item => item.key);
    dynamicColumns.value = columns
      .filter(item => state.checkedList.includes(item.dataIndex))
      .sort((a, b) => {
        const aKey = a.key || a.dataIndex;
        const bKey = b.key || b.dataIndex;
        return keys.indexOf(aKey) - keys.indexOf(bKey);
      })
      .map(item => item);
  };

  watch(
    () => state.checkedList,
    () => {
      state.checkAll =
        !!state.checkedList.length && state.checkedList.length === dynamicColumnValues.length;
      state.indeterminate =
        !!state.checkedList.length && state.checkedList.length < dynamicColumnValues.length;
      planColumns();
    },
    {
      deep: true,
    },
  );
  watch(
    () => dynamicColumnItems,
    () => {
      planColumns();
    },
    {
      deep: true,
    },
  );

  const handleColumnChange = (e, column) => {
    const checked = e.target.checked;
    column.checked = checked;

    if (checked) {
      !state.checkedList.includes(column.key) && state.checkedList.push(column.key);
    } else {
      state.checkedList = state.checkedList.filter(item => item !== column.key);
    }
  };

  const handleColumnAllClick = e => {
    const checked = e.target.checked;
    state.checkedList = checked ? dynamicColumnValues : [];
    dynamicColumnItems.value = dynamicColumnItems.value.map(column => {
      column.checked = checked;
      return column;
    });
  };

  const reset = () => {
    state.checkedList = dynamicColumnValues;
    dynamicColumnItems.value = columns.map(column => {
      return {
        key: column?.key || column.dataIndex,
        label: column.title,
        checked: checkAll,
      };
    });
  };

  const move = (index, targetIndex) => {
    const newColumnItems = dynamicColumnItems.value;
    const columnItemKey = newColumnItems[index];
    newColumnItems.splice(index, 1);

    if (targetIndex === 0) {
      newColumnItems.unshift(columnItemKey);
    } else {
      newColumnItems.splice(targetIndex, 0, columnItemKey);
    }

    dynamicColumnItems.value = newColumnItems;
  };

  return {
    dynamicColumns,
    dynamicColumnItems,
    state,
    reset,
    handleColumnAllClick,
    handleColumnChange,
    move,
  };
};
