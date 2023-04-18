import System.Environment (getArgs)

romanToInt :: [Char] -> Int
romanToInt ""           = 0
romanToInt "I"          = 1
romanToInt "V"          = 5
romanToInt "X"          = 10
romanToInt "L"          = 50
romanToInt "C"          = 100
romanToInt "D"          = 500
romanToInt "M"          = 1000
romanToInt ('I':'V':xs) = 4   + romanToInt xs
romanToInt ('I':'X':xs) = 9   + romanToInt xs
romanToInt ('X':'L':xs) = 40  + romanToInt xs
romanToInt ('X':'C':xs) = 90  + romanToInt xs
romanToInt ('C':'D':xs) = 400 + romanToInt xs
romanToInt ('C':'M':xs) = 900 + romanToInt xs
romanToInt (c:xs)       = romanToInt [c] + romanToInt xs

main = do
    args <- getArgs
    let res = romanToInt (head args)
    print res