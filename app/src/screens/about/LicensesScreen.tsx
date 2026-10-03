// 授權與致謝（TASK-21）：列出 NOTICE 的全部條目（資料、模型、元件與授權）；設定 → 隱私說明・授權・原始碼 進入
import { t } from '../../i18n/t'
import { SubScreen } from '../../shell/Screen'
import { Card } from '../../ui/Card'
import { CREDIT_SECTIONS } from './credits'

export function LicensesScreen() {
  return (
    <SubScreen title={t('licenses.page.title')}>
      <div data-testid="screen-licenses" className="contents">
        <p className="text-secondary text-muted">{t('licenses.page.intro')}</p>
        {CREDIT_SECTIONS.map((section) => (
          <section key={section.id} className="grid gap-2">
            <h2 className="px-1 pt-2 text-caption tracking-[0.04em] text-muted">
              {t(`licenses.section.${section.id}`)}
            </h2>
            {section.credits.map((id) => (
              <Card key={id} tight>
                <h3 data-testid="credit-name" className="font-bold wrap-anywhere">
                  {t(`credits.${id}.name`)}
                </h3>
                <p className="text-secondary wrap-anywhere">
                  {t('licenses.page.license', {
                    license: t(`credits.${id}.license`),
                  })}
                </p>
                <p className="text-secondary text-muted wrap-anywhere">{t(`credits.${id}.note`)}</p>
              </Card>
            ))}
          </section>
        ))}
        <p className="text-secondary text-muted">{t('licenses.page.more')}</p>
      </div>
    </SubScreen>
  )
}
