import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import PayrollPage from '@/app/(app)/payroll/page';

describe('payroll page', () => {
  it('renders payroll tabs and switches the selected document', () => {
    render(<PayrollPage />);

    expect(screen.queryByRole('heading', { name: 'Payroll' })).toBeNull();
    expect(screen.queryByText('Employee workspace')).toBeNull();
    expect(screen.queryByText('Your payroll documents in one place')).toBeNull();
    expect(screen.getByRole('tablist', { name: 'Documents' })).toBeTruthy();
    expect(screen.queryByText('Payroll documents')).toBeNull();
    expect(screen.getByRole('tab', { name: 'Official letter' })).toBeTruthy();
    expect(screen.getByRole('tab', { name: 'Tax-payroll' })).toBeTruthy();
    expect(screen.getByRole('tab', { name: 'Payslip' }).getAttribute('aria-selected')).toBe('true');
    expect(screen.getByRole('button', { name: 'Download' }).hasAttribute('disabled')).toBe(false);
    expect(screen.getAllByRole('option')).toHaveLength(6);

    fireEvent.click(screen.getByRole('tab', { name: 'Official letter' }));
    expect(screen.getByRole('tab', { name: 'Official letter' }).getAttribute('aria-selected')).toBe('true');
    expect(screen.getByRole('tabpanel').getAttribute('aria-labelledby')).toBe('payroll-tab-official-letter');
    expect(screen.getAllByRole('option')).toHaveLength(3);
  });

  it('downloads the selected letter and payslip automatically', () => {
    let downloadedFilename = '';
    let downloadedHtml = '';
    vi.spyOn(HTMLAnchorElement.prototype, 'click').mockImplementation(function (this: HTMLAnchorElement) {
      downloadedFilename = this.download;
      downloadedHtml = decodeURIComponent(this.href.split(',').slice(1).join(','));
    });
    render(<PayrollPage />);

    fireEvent.click(screen.getByRole('tab', { name: 'Official letter' }));
    fireEvent.change(screen.getByRole('combobox', { name: 'Letter type' }), { target: { value: 'compensation' } });
    fireEvent.click(screen.getByRole('button', { name: 'Download' }));
    expect(downloadedFilename).toBe('compensation-letter.html');
    expect(downloadedHtml).toContain('Compensation Letter');
    expect(downloadedHtml).toContain('USD 86,400');

    fireEvent.click(screen.getByRole('tab', { name: 'Payslip' }));
    fireEvent.change(screen.getByRole('combobox', { name: 'Pay period' }), { target: { value: '2026-02' } });
    fireEvent.click(screen.getByRole('button', { name: 'Download' }));
    expect(downloadedFilename).toBe('payslip-2026-02.html');
    expect(downloadedHtml).toContain('February 2026');
    expect(downloadedHtml).toContain('USD 6,000');
  });
});