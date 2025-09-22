import Button from "@components/commons/Button";
import Icon from "@components/commons/Icon";
import { usePageTitle } from "@hooks/usePageTitle";
import { getData } from "@services/api/controllers/dataManager";
import type { DataType } from "@services/api/types/DataType";
import { downloadFile } from "@utils/downloadFile";
import { formatDate } from "@utils/formatDate";
import { getFileSize } from "@utils/getFileSize";
import { useEffect, useState } from "react";

const HistoryPage = () => {
  usePageTitle("Results");
  const [allData, setAllData] = useState<DataType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getData();
      if (data.status === "success") {
        setAllData(data.result);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-[60rem] mx-auto mt-10">
      <table className="w-full *:text-center *:text-sm">
        <thead className="**:px-4 **:py-2">
          <tr className="*:font-medium *:text-lg *:border-b">
            <th className="border-border-strong-light dark:border-border-strong-dark border-e">
              ID
            </th>
            <th className="border-border-strong-light dark:border-border-strong-dark border-e">
              FILENAME
            </th>
            <th className="border-border-strong-light dark:border-border-strong-dark border-e">
              FILESIZE
            </th>
            <th className="border-border-strong-light dark:border-border-strong-dark border-e">
              GENERATED AT
            </th>
            <th className="border-border-strong-light dark:border-border-strong-dark">
              ACTIONS
            </th>
          </tr>
        </thead>
        <tbody>
          {allData.length > 0 ? (
            allData
              .slice()
              .reverse()
              .map((data: DataType) => (
                <tr
                  key={data.id}
                  className="*:border-border-strong-light *:dark:border-border-strong-dark *:border-b *:px-4 *:py-2 *:whitespace-nowrap *:truncate"
                >
                  <td className="max-w-[10rem] w-[10rem]" title={data.id}>
                    {data.id}
                  </td>
                  <td className="max-w-[20rem] w-[20rem]" title={data.fileName}>
                    {data.fileName}
                  </td>
                  <td className="max-w-[5rem] w-[5rem]">
                    {getFileSize(data.content)}
                  </td>
                  <td className="max-w-[15rem] w-[15rem]">
                    {formatDate(data.generatedAt)}
                  </td>
                  <td className="max-w-[10rem] w-[10rem]">
                    <div className="flex justify-between">
                      <Button
                        onClick={() =>
                          downloadFile(data.fileName, data.content)
                        }
                        className="flex"
                        buttonType="success"
                        isOutline={true}
                      >
                        <Icon iconName="download" />
                      </Button>
                      <Button
                        className="flex"
                        buttonType="danger"
                        isOutline={true}
                      >
                        <Icon iconName="delete_forever" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
          ) : (
            <tr>
              <td colSpan={4}>
                <div className="gap-1 flex px-4 py-2 text-base items-center justify-center text-text-secondary-light dark:text-text-secondary-dark">
                  No existing data...
                  <Icon iconName="crisis_alert" />
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default HistoryPage;
