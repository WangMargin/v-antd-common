import {
  HeartOutlined,
  HistoryOutlined,
  FormOutlined,
  TableOutlined,
  AppstoreAddOutlined,
  UnorderedListOutlined,
  WarningOutlined,
  CheckCircleOutlined,
  HomeOutlined,
} from '@ant-design/icons-vue';
export const useIcons = app => {
  app.component(HeartOutlined.displayName, HeartOutlined);
  app.component(HistoryOutlined.displayName, HistoryOutlined);
  app.component(FormOutlined.displayName, FormOutlined);
  app.component(TableOutlined.displayName, TableOutlined);
  app.component(AppstoreAddOutlined.displayName, AppstoreAddOutlined);
  app.component(UnorderedListOutlined.displayName, UnorderedListOutlined);
  app.component(WarningOutlined.displayName, WarningOutlined);
  app.component(CheckCircleOutlined.displayName, CheckCircleOutlined);
  app.component(HomeOutlined.displayName, HomeOutlined);
};
