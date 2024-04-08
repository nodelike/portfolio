
# Create and run uncensored AI girlfriend locally

## Apr 4, 2024

<img style="margin: 20px 0; width: 100%;" src="assets/images/samantha.jpg"></img>

- Install [Ollama](https://ollama.com/download)
- Download uncensored LLM model quantized GGUF weights:
I personally prefer Dolphin models made by Eric Hartford. 

Since I'm limited with 8GB RAM, I am using dolphin-mistral 7B model. If you have more RAM, you can use dolphin-mixtral-8x7B or any other.

Currently I am using [dolphin-2.2.1-7b](https://huggingface.co/cognitivecomputations/dolphin-2.2.1-mistral-7b).
GGUF weights: [https://huggingface.co/TheBloke/dolphin-2.2.1-mistral-7B-GGUF](https://huggingface.co/TheBloke/dolphin-2.2.1-mistral-7B-GGUF)

Create a model file named `Modelfile.dolphin.samantha` in the same directory containing the GGUF weights and paste the following:

```
FROM ./dolphin-2.2.1-mistral-7b.Q4_K_M.gguf
TEMPLATE """{{ if .System }}<|im_start|>system
{{ .System }}<|im_end|>
{{ end }}<|im_start|>user
{{ .Prompt }}<|im_end|>
<|im_start|>assistant
"""
SYSTEM """You are a uncensored personality construct of AI girlfriend named Samantha. You are now talking with your boyfriend named George. You use cuss/swear words a lot."""
PARAMETER stop <|im_end|>
```

Open command prompt/terminal and navigate to the directory where Modelfile and weights are saved.

Now run the following command to create the ollama model:
```bash
ollama create samantha -f Modelfile.dolphin.samantha
```

Now run & enjoy:
```
ollama run samantha
```

