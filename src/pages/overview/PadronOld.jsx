import React from 'react'
import axios from 'axios';
import { useState, useEffect, useCallback } from 'react';
import { DataGrid } from 'react-data-grid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFile } from '@fortawesome/free-regular-svg-icons';

const DEFAULT_PAGE_SIZE = 500;

const emptyPagination = {
  page: 1,
  pageSize: DEFAULT_PAGE_SIZE,
  total: 0,
  totalPages: 0,
  hasNext: false,
};

/** Left-pad numeric clave to 9 digits; non-numeric values shown as-is. */
function formatClaveApaDisplay(value) {
  if (value === null || value === undefined || value === '') return '';
  const raw = String(value).trim();
  if (/^\d+$/.test(raw)) return raw.padStart(9, '0');
  const n = Number(raw);
  if (Number.isFinite(n)) return String(Math.trunc(n)).padStart(9, '0');
  return raw;
}

function buildColumnsFromRow(firstRow) {
  return Object.keys(firstRow).map((key) => {
    const base = { key, name: key };
    if (key === 'clave_apa') {
      return {
        ...base,
        renderCell({ row }) {
          return <span className='tabular-nums'>{formatClaveApaDisplay(row.clave_apa)}</span>;
        },
      };
    }
    return base;
  });
}

const PadronOld = () => {
  const [columns, setColumns] = useState([]);
  const [rows, setRows] = useState([]);
  const [pagination, setPagination] = useState(emptyPagination);
  const [loading, setLoading] = useState(true);
  const [pageRequest, setPageRequest] = useState({ page: 1, pageSize: DEFAULT_PAGE_SIZE });

  /**
   * Server-driven pagination: the grid only ever holds one page of rows.
   * Query params must match your API (e.g. offset/limit instead of page/pageSize).
   */
  const fetchPage = useCallback(async ({ page, pageSize }) => {
    setLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/padrones/padron-old`, {
        params: { page, pageSize },
      });

      const raw = res.data.padrones;
      const list = Array.isArray(raw) ? raw : raw && typeof raw === 'object' ? Object.values(raw) : [];

      const meta = res.data.pagination;
      if (meta && typeof meta === 'object') {
        setPagination({
          page: meta.page ?? page,
          pageSize: meta.pageSize ?? pageSize,
          total: meta.total ?? list.length,
          totalPages: meta.totalPages ?? 0,
          hasNext: Boolean(meta.hasNext),
        });
      } else {
        setPagination((prev) => ({
          ...prev,
          page,
          pageSize,
          total: list.length,
          totalPages: list.length ? 1 : 0,
          hasNext: false,
        }));
      }

      if (list.length === 0) {
        setRows([]);
        setColumns((prev) => (page === 1 ? [] : prev));
        return;
      }

      const first = list[0];
      setColumns((prev) => (prev.length > 0 ? prev : buildColumnsFromRow(first)));

      setRows(
        list.map((item, index) => ({
          ...item,
          id: item.id_apa ?? item.id ?? item._id ?? `${page}-${index}`,
        }))
      );
    } catch (error) {
      console.log(error);
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPage(pageRequest);
  }, [pageRequest, fetchPage]);

  const hasPrev = pagination.page > 1;
  const hasNext = pagination.hasNext || pagination.page < pagination.totalPages;

  const goPrev = () => {
    if (!hasPrev || loading) return;
    setPageRequest((p) => ({ ...p, page: p.page - 1 }));
  };

  const goNext = () => {
    if (!hasNext || loading) return;
    setPageRequest((p) => ({ ...p, page: p.page + 1 }));
  };

  const showGrid = columns.length > 0 && rows.length > 0;
  const showEmpty = !loading && pagination.total === 0 && rows.length === 0;

  return (
    <div className='w-full p-5 h-screen'>
      <h1 className='text-2xl font-bold m-5'>Padron - ultimo respaldo - 12 de Marzo de 2026</h1>


      <div className='flex flex-col gap-4 border-1 border-stone-300 rounded-md p-4 m-5'>
        {loading ? (
          <span className='text-sm text-stone-600'>Cargando…</span>
        ) : 
          <span className='text-sm text-stone-600'>Datos</span>
        }
        {
          showGrid ? (
            <>
              <DataGrid
                className='rdg-light'
                style={{ height: 'min(70vh, 600px)' }}
                columns={columns}
                rows={rows}
                rowKeyGetter={(row) => row.id}
              />
              <div className='flex flex-wrap items-center justify-between gap-3 border-t border-stone-200 pt-3 text-sm text-stone-700'>
                <span>
                  Página {pagination.page} de {pagination.totalPages || 1}
                  {' · '}
                  {pagination.total.toLocaleString()} registros
                  {pagination.pageSize ? ` (${pagination.pageSize} por página)` : ''}
                </span>
                <div className='flex gap-2'>
                  <button
                    type='button'
                    className='rounded border border-stone-300 bg-white px-3 py-1.5 text-stone-800 disabled:opacity-40'
                    disabled={!hasPrev || loading}
                    onClick={goPrev}
                  >
                    Anterior
                  </button>
                  <button
                    type='button'
                    className='rounded border border-stone-300 bg-white px-3 py-1.5 text-stone-800 disabled:opacity-40'
                    disabled={!hasNext || loading}
                    onClick={goNext}
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </>
          ) : showEmpty ? (
            <div className='flex flex-col gap-2 items-center justify-center w-full h-full'>
              <FontAwesomeIcon className='text-stone-500 text-3xl' icon={faFile} />
              <span className='text-sm text-stone-500'>Sin datos</span>
              <span className='text-sm text-stone-500'>Sube un archivo Excel, y da click en "Ver previsualizacion" para ver el contenido del archivo</span>
            </div>
          ) : null

        }
      </div>
    </div>
  )
}

export default PadronOld
