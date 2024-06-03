(function() {
    'use strict';

    kintone.events.on('app.record.index.show', function(event) {
        // CSVからインポートされた新しいデータを処理するロジックをここに追加
    });

    kintone.events.on('app.record.create.submit', function(event) {
        var record = event.record;
        var studentID = record['学生ID'].value;

        var query = '学生ID = "' + studentID + '"';
        return kintone.api(kintone.api.url('/k/v1/records', true), 'GET', { app: kintone.app.getId(), query: query }).then(function(resp) {
            if (resp.records.length > 0) {
                // 既存のレコードが見つかった場合
                var existingRecord = resp.records[0];
                existingRecord['JLPTレベル'].value += ', ' + record['JLPTレベル'].value;

                var updateBody = {
                    app: kintone.app.getId(),
                    id: existingRecord.$id.value,
                    record: {
                        'JLPTレベル': {
                            value: existingRecord['JLPTレベル'].value
                        }
                    }
                };

                return kintone.api(kintone.api.url('/k/v1/record', true), 'PUT', updateBody).then(function() {
                    // レコードの追加をキャンセル
                    event.error = '既存のレコードが更新されました。新しいレコードは作成されませんでした。';
                    return event;
                });
            } else {
                // 新しいレコードを作成する場合はそのまま
                return event;
            }
        });
    });
})();
