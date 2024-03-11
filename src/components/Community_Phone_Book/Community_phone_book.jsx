import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import '../../../app/globals.css'
import Container from '../Container/Container';
import '../../../src/assets/css/style.css'
import 'datatables.net-dt/css/jquery.dataTables.min.css';
import $ from 'jquery';
import DataTable from 'datatables.net';
import { writeFile } from 'xlsx';
import * as XLSX from 'xlsx';


const Community_phone_book = () => {
  const [community, setCommunity] = useState([]);
  const tableRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const initializeDataTable = () => {
      if (tableRef.current) {

        $(tableRef.current).DataTable({
          responsive: true,
        });
      }
    };

    const destroyDataTable = () => {
      const dataTable = $(tableRef.current).DataTable();
      if (dataTable) {
        dataTable.destroy();
      }
    };

    destroyDataTable();
    initializeDataTable();

    return () => {
      destroyDataTable();
    };
  }, [community]);



  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const response = await fetch('https://api.schoolnutritionindustryprofessionals.com/api/communityphonebook');
        if (response.ok) {
          const data = await response.json();
          setCommunity(data);
        } else {
          setError('Failed to fetch event data');
        }
      } catch (error) {
        setError(`Error: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, []);


// Download Xlsx file
const handleDownloadExcel = () => {
  // Prepare data for Excel file
  const excelData = community.map((community) => ({
    'Id': community.id,
    'First Name': community.f_name,
    'Last Name': community.l_name,
    'Email': community.email,
    'Company': community.company,
    'Title': community.title,
    'Phone': community.phone,
    'Address': community.address,
    'City': community.city,
    'State': community.state,
    'Zip Code': community.zip_code,
    'Website Url': community.website,
  }));

  // Create a worksheet
  const ws = XLSX.utils.json_to_sheet(excelData);

  // Create a workbook
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'users');

  // Save the workbook to a file
  writeFile(wb, 'community-phone-book.xlsx');
};


  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>

      <div className="event-table my-12">
        <Container>
          <table ref={tableRef} id="myTable" className="w-full table-auto border border-collapse border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border p-4">Id</th>
                <th className="border p-4">First Name</th>
                <th className="border p-4">Last Name</th>
                <th className="border p-4">Email</th>
                <th className="border p-4">Company</th>
                <th className="border p-4">Title</th>
                <th className="border p-4">Phone</th>
                <th className="border p-4">Address</th>
                <th className="border p-4">City</th>
                <th className="border p-4">State</th>
                <th className="border p-4">Zip Code</th>
                <th className="border p-4">Website URL</th>
              </tr>
            </thead>
            <tbody>
              {community.map((community) => (
                <tr key={community.id} className="hover:bg-gray-100">
                  <td className="border p-4">{community.id}</td>
                  <td className="border p-4">{community.f_name}</td>
                  <td className="border p-4">{community.l_name}</td>
                  <td className="border p-4">{community.email}</td>
                  <td className="border p-4">{community.company}</td>
                  <td className="border p-4">{community.title}</td>
                  <td className="border p-4">{community.phone}</td>
                  <td className="border p-4">{community.address}</td>
                  <td className="border p-4">{community.city}</td>
                  <td className="border p-4">{community.state}</td>
                  <td className="border p-4">{community.zip_code}</td>
                  <td className="border p-4">{community.website}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className='all-user-download'>
            <button
              className="text-white text-xl float-right inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-3 text-sm font-semibold shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto"
              onClick={handleDownloadExcel}
            >
              Download Community Phone Book
            </button>
          </div>
        </Container>
      </div>
    </div>
  );
};

export default Community_phone_book;
