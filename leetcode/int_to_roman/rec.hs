import System.Environment (getArgs)

intToRoman :: Int -> String
intToRoman 0 = ""
intToRoman x | x <  4    = "I"  ++ intToRoman (x - 1)
             | x == 4    = "IV"
             | x <  9    = "V"  ++ intToRoman (x - 5)
             | x == 9    = "IX"
             | x < 40    = "X"  ++ intToRoman (x - 10)
             | x < 50    = "XL" ++ intToRoman (x - 40)
             | x < 90    = "L"  ++ intToRoman (x - 50)
             | x < 100   = "XC" ++ intToRoman (x - 90)
             | x < 400   = "C"  ++ intToRoman (x - 100)
             | x < 500   = "CD" ++ intToRoman (x - 400)
             | x < 900   = "D"  ++ intToRoman (x - 500)
             | x < 1000  = "CM" ++ intToRoman (x - 900)
             | otherwise = "M"  ++ intToRoman (x - 1000)

newtype NoQuote = NoQuote String
instance Show NoQuote where show (NoQuote s) = s

main = do
    args <- getArgs
    let x = read (head args) :: Int
    let res = intToRoman x
    print (NoQuote res)