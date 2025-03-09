import React from "react";
import { FaFilePdf } from "react-icons/fa";

const FileTable = () => {
  return (
    <div className="border rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-200 text-left text-sm">
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">Last Modified</th>
            <th className="p-2">Size</th>
            <th className="p-2">Type</th>
          </tr>
        </thead>
        <tbody>
          <tr className="border-t">
            <td className="p-2 flex items-center">
              <FaFilePdf className="text-red-500 mr-2" />
              gch211342-HoangVuQuangHuy.pdf
            </td>
            <td className="p-2">04/03/2025, 10:40</td>
            <td className="p-2">151.9KB</td>
            <td className="p-2">PDF Document</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default FileTable;
