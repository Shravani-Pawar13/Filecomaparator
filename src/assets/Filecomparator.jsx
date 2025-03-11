import React, { useState } from "react";
import Papa from "papaparse";
import 'bootstrap/dist/css/bootstrap.min.css';


// or less ideally
import { Button } from 'react-bootstrap';

function Filecomparator() {
  const [file1Data, setFile1Data] = useState([]);
  const [file2Data, setFile2Data] = useState([]);
  const [differences, setDifferences] = useState([]);
  const [columns, setColumns] = useState([]);
  const [ignoreColumns, setIgnoreColumns] = useState([]);

  const handleFileUpload = (event, setFileData, setColumnsState) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      alert("Please upload a valid CSV file.");
      return;
    }

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        if (result.data.length === 0) {
          alert("The uploaded file is empty or invalid.");
        } else {
          setFileData(result.data);
          setColumnsState(Object.keys(result.data[0] || {}));
        }
      },
    });
  };

  const compareFiles = () => {
    if (file1Data.length === 0 || file2Data.length === 0) {
      alert("Please upload both CSV files.");
      return;
    }

    const diff = [];
    const maxLength = Math.max(file1Data.length, file2Data.length);

    for (let i = 0; i < maxLength; i++) {
      const row1 = file1Data[i] || {};
      const row2 = file2Data[i] || {};

      const rowDiff = {};
      Object.keys({ ...row1, ...row2 })
        .filter((key) => !ignoreColumns.includes(key))
        .forEach((key) => {
          if (row1[key] !== row2[key]) {
            rowDiff[key] = { file1: row1[key] || "N/A", file2: row2[key] || "N/A" };
          }
        });

      if (Object.keys(rowDiff).length > 0) {
        diff.push({ row: i + 1, differences: rowDiff });
      }
    }

    setDifferences(diff);
  };

  const downloadCSV = () => {
    if (differences.length === 0) {
      alert("No differences to download.");
      return;
    }

    const csvData = [];
    differences.forEach((diff) => {
      Object.keys(diff.differences).forEach((key) => {
        csvData.push({
          Row: diff.row,
          Column: key,
          "File 1 Value": diff.differences[key].file1,
          "File 2 Value": diff.differences[key].file2,
        });
      });
    });

    const csvString = Papa.unparse(csvData);
    const blob = new Blob([csvString], { type: "text/csv" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "comparison_results.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 border-b">
      <h2 className="text-lg font-bold">File Comparison</h2>
      <input type="file" className="border text-black px-1 py-2 rounded cursor-pointer" accept=".csv" onChange={(e) => handleFileUpload(e, setFile1Data, setColumns)} />
      <input type="file" className="border text-black px-1 py-2 rounded cursor-pointer" accept=".csv" onChange={(e) => handleFileUpload(e, setFile2Data, () => {})} />

      {/* Ignore Column Selection */}
      {columns.length > 0 && (
        <div className="mt-2">
          <h3 className="font-semibold">Ignore Columns:</h3>
          {columns.map((col) => (
            <label key={col} className="mr-2">
              <input
                type="checkbox"
                checked={ignoreColumns.includes(col)}
                onChange={() =>
                  setIgnoreColumns((prev) =>
                    prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col]
                  )
                }
              />
              {col}
            </label>
          ))}
        </div>
      )}

      <button className="bg-blue-500 text-white px-4 py-2 mt-2" onClick={compareFiles}>Compare</button>

      {differences.length > 0 && (
        <div className="mt-4">
          <h3 className="font-bold">Differences:</h3>
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="border px-4 py-2">Row</th>
                <th className="border px-4 py-2">Column</th>
                <th className="border px-4 py-2">File 1 Value</th>
                <th className="border px-4 py-2">File 2 Value</th>
              </tr>
            </thead>
            <tbody>
              {differences.map((diff, index) =>
                Object.keys(diff.differences).map((key, subIndex) => (
                  <tr key={`${index}-${subIndex}`} className="border-b">
                    <td className="border px-4 py-2">{diff.row}</td>
                    <td className="border px-4 py-2">{key}</td>
                    <td className="border px-4 py-2 bg-blue-100">{diff.differences[key].file1}</td>
                    <td className="border px-4 py-2 bg-blue-100">{diff.differences[key].file2}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <button className="mt-4 bg-green-500 text-white px-4 py-2" onClick={downloadCSV}>Download CSV</button>
        </div>
      )}
    </div>
  );
}

export default Filecomparator;
