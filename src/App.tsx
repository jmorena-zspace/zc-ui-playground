import { motion } from 'motion/react'

import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

function App() {
  return (
    <main className="grid h-full place-items-center p-lg">
      <motion.div
        initial={{ opacity: 0, y: 12, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 24 }}
        whileHover={{ y: -4 }}
      >
        {/* rounded-md, not shadcn's default rounded-xl: the zSpace radius scale
            runs 8/16/24/32px, so xl reads as a pill at this size. */}
        <Card className="w-[360px] rounded-md">
          <CardHeader>
            <CardTitle className="font-display text-display-sm">
              Card playground
            </CardTitle>
            <CardDescription>
              Drop components in here and play around.
            </CardDescription>
          </CardHeader>
        </Card>
      </motion.div>
    </main>
  )
}

export default App
