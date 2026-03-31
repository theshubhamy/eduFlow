<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Fee Receipt - {{ $payment->receipt_number }}</title>
    <style>
        body { font-family: 'Helvetica', sans-serif; color: #333; line-height: 1.6; }
        .container { width: 100%; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #eee; padding-bottom: 10px; }
        .school-name { font-size: 24px; font-weight: bold; color: #1a73e8; }
        .receipt-title { font-size: 18px; margin-top: 10px; text-transform: uppercase; letter-spacing: 1px; }
        .info-grid { width: 100%; margin-bottom: 30px; }
        .info-grid td { padding: 5px 0; }
        .label { font-weight: bold; width: 150px; }
        .table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
        .table th { background: #f8f9fa; border: 1px solid #dee2e6; padding: 10px; text-align: left; }
        .table td { border: 1px solid #dee2e6; padding: 10px; }
        .total-row { font-weight: bold; font-size: 16px; background: #f1f3f4; }
        .footer { text-align: center; margin-top: 50px; font-size: 12px; color: #777; border-top: 1px solid #eee; padding-top: 10px; }
        .stamp { margin-top: 30px; text-align: right; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="school-name">SCHOOL MANAGEMENT SaaS</div>
            <div class="receipt-title">Official Fee Receipt</div>
        </div>

        <table class="info-grid">
            <tr>
                <td class="label">Receipt Number:</td>
                <td>{{ $payment->receipt_number }}</td>
                <td class="label">Date:</td>
                <td>{{ $payment->payment_date->format('d M, Y') }}</td>
            </tr>
            <tr>
                <td class="label">Student Name:</td>
                <td>{{ $payment->student->user->name }}</td>
                <td class="label">Period:</td>
                <td>{{ $payment->period_identifier }}</td>
            </tr>
            <tr>
                <td class="label">Admission No:</td>
                <td>{{ $payment->student->roll_number }}</td>
                <td class="label">Method:</td>
                <td>{{ strtoupper($payment->method) }}</td>
            </tr>
        </table>

        <table class="table">
            <thead>
                <tr>
                    <th>Description</th>
                    <th>Periodicity</th>
                    <th style="text-align: right;">Amount</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>{{ $payment->feeAllocation->feeCategory->name }}</td>
                    <td>{{ ucfirst($payment->feeAllocation->feeCategory->periodicity) }}</td>
                    <td style="text-align: right;">{{ number_format($payment->amount_paid, 2) }}</td>
                </tr>
                <tr class="total-row">
                    <td colspan="2" style="text-align: right;">Total Paid</td>
                    <td style="text-align: right;">{{ number_format($payment->amount_paid, 2) }}</td>
                </tr>
            </tbody>
        </table>

        <div class="stamp">
            <p>__________________________</p>
            <p>Authorized Signature</p>
        </div>

        <div class="footer">
            <p>This is a computer-generated receipt and does not require a physical signature.</p>
            <p>Thank you for your payment!</p>
        </div>
    </div>
</body>
</html>
